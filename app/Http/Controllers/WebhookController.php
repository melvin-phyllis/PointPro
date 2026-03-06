<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    public function cinetpay(Request $request)
    {
        try {
            $data = $request->all();
            Log::info('CinetPay webhook', $data);
            $this->paymentService->handlePaymentWebhook('cinetpay', $data);
        } catch (\Throwable $e) {
            Log::error('CinetPay webhook error: ' . $e->getMessage());
        }
        return response('OK', 200);
    }

    public function fedapay(Request $request)
    {
        try {
            $data = $request->all();
            Log::info('FedaPay webhook', $data);
            $this->paymentService->handlePaymentWebhook('fedapay', $data);
        } catch (\Throwable $e) {
            Log::error('FedaPay webhook error: ' . $e->getMessage());
        }
        return response('OK', 200);
    }

    public function wave(Request $request)
    {
        try {
            $data = $request->all();
            Log::info('Wave webhook', $data);
            $this->paymentService->handlePaymentWebhook('wave', $data);
        } catch (\Throwable $e) {
            Log::error('Wave webhook error: ' . $e->getMessage());
        }
        return response('OK', 200);
    }
}
