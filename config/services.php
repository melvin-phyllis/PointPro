<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Passerelles de paiement (Afrique de l'Ouest)
    |--------------------------------------------------------------------------
    */

    'cinetpay' => [
        'api_key'  => env('CINETPAY_API_KEY'),
        'site_id'  => env('CINETPAY_SITE_ID'),
        'notify'   => env('CINETPAY_NOTIFY_URL', '/webhooks/cinetpay'),
        'return'   => env('CINETPAY_RETURN_URL'),
    ],

    'fedapay' => [
        'secret_key'  => env('FEDAPAY_SECRET_KEY'),
        'public_key'  => env('FEDAPAY_PUBLIC_KEY'),
        'environment' => env('FEDAPAY_ENV', 'sandbox'),
        'webhook_url' => env('FEDAPAY_WEBHOOK_URL', '/webhooks/fedapay'),
    ],

    'wave' => [
        'api_key'     => env('WAVE_API_KEY'),
        'secret_key'  => env('WAVE_SECRET_KEY'),
        'webhook_url' => env('WAVE_WEBHOOK_URL', '/webhooks/wave'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification demandes de devis
    |--------------------------------------------------------------------------
    | Email(s) à notifier à chaque nouvelle demande de devis (séparés par des virgules).
    | Si vide, utilise MAIL_FROM_ADDRESS.
    */
    'quote_request_notify_email' => env('QUOTE_REQUEST_NOTIFY_EMAIL')
        ? array_filter(array_map('trim', explode(',', env('QUOTE_REQUEST_NOTIFY_EMAIL'))))
        : [config('mail.from.address')],

];
