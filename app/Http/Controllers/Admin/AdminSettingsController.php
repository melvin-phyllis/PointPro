<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'app_name'     => config('app.name'),
                'app_url'      => config('app.url'),
                'mail_from'    => config('mail.from.address'),
                'cinetpay'     => config('services.cinetpay.site_id') ? '✓ Configuré' : '✗ Non configuré',
                'fedapay'      => config('services.fedapay.public_key') ? '✓ Configuré' : '✗ Non configuré',
                'wave'         => config('services.wave.api_key') ? '✓ Configuré' : '✗ Non configuré',
            ],
        ]);
    }
}
