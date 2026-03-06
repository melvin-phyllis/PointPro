<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Payment;
use App\Models\Plan;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    public function index(Request $request)
    {
        $payments = Payment::with(['company', 'subscription.plan'])
            ->when($request->search, fn($q, $s) =>
                $q->whereHas('company', fn($q) => $q->where('name', 'like', "%{$s}%"))
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->method, fn($q, $m) => $q->where('payment_method', $m))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $totalRevenue = Payment::where('status', 'completed')->sum('amount');

        return Inertia::render('Admin/Payments/Index', [
            'payments'     => $payments,
            'total_revenue'=> $totalRevenue,
            'filters'      => $request->only(['search', 'status', 'method']),
        ]);
    }

    public function create(Request $request)
    {
        $company = $request->company_id ? Company::findOrFail($request->company_id) : null;
        $plans   = Plan::active()->ordered()->get();
        $companies = Company::orderBy('name')->get(['id', 'name', 'plan']);

        return Inertia::render('Admin/Payments/Create', [
            'company'   => $company,
            'plans'     => $plans,
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id'       => 'required|exists:companies,id',
            'plan_id'          => 'required|exists:plans,id',
            'amount'           => 'required|integer|min:0',
            'payment_method'   => 'required|in:mobile_money,bank_transfer,cash,wave,other',
            'metadata'         => 'nullable|array',
            'metadata.phone'   => 'nullable|string',
            'metadata.operator'=> 'nullable|string',
            'metadata.bank'    => 'nullable|string',
            'metadata.reference'=> 'nullable|string',
            'notes'            => 'nullable|string',
        ]);

        $company = Company::findOrFail($validated['company_id']);
        $plan    = Plan::findOrFail($validated['plan_id']);

        $payment = $this->paymentService->createManualPayment(
            $company,
            $plan,
            $validated['amount'],
            $validated['payment_method'],
            $validated['metadata'] ?? [],
            $validated['notes'] ?? null
        );

        return redirect()->route('admin.companies.show', $company)
            ->with('success', "Paiement de {$payment->formattedAmount()} enregistré avec succès.");
    }

    public function show(Payment $payment)
    {
        $payment->load(['company', 'subscription.plan', 'createdBy']);
        return Inertia::render('Admin/Payments/Show', ['payment' => $payment]);
    }
}
