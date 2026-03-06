<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::with(['company', 'payment'])
            ->when($request->search, fn($q, $s) =>
                $q->whereHas('company', fn($q) => $q->where('name', 'like', "%{$s}%"))
                  ->orWhere('invoice_number', 'like', "%{$s}%")
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $invoices,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function send(Invoice $invoice)
    {
        $invoice->markAsSent();
        return back()->with('success', "Facture {$invoice->invoice_number} marquée comme envoyée.");
    }
}
