<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouvelle demande de devis</title></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0D1117;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:30px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#10B981;font-size:22px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:30px 24px;">
        <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">📋 Nouvelle demande de devis</h2>
        <table width="100%" style="margin:16px 0;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;">Entreprise</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ $quoteRequest->company_name }}</td></tr>
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Forfait</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ ucfirst($quoteRequest->plan) }}</td></tr>
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Contact</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ $quoteRequest->first_name }} {{ $quoteRequest->last_name }}</td></tr>
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Email</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;"><a href="mailto:{{ $quoteRequest->email }}" style="color:#10B981;">{{ $quoteRequest->email }}</a></td></tr>
            @if($quoteRequest->phone)
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Téléphone</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ $quoteRequest->phone }}</td></tr>
            @endif
            @if($quoteRequest->message)
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);vertical-align:top;">Message</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;white-space:pre-wrap;">{{ $quoteRequest->message }}</td></tr>
            @endif
        </table>
        <div style="text-align:center;margin:24px 0;">
            <a href="{{ config('app.url') }}/admin/demandes-devis/{{ $quoteRequest->id }}" style="display:inline-block;padding:12px 28px;background:#10B981;color:#fff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">Voir la demande</a>
        </div>
    </td></tr>
    <tr><td style="padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#4B5563;font-size:11px;margin:0;">© {{ date('Y') }} PointPro</p>
    </td></tr>
</table>
</body>
</html>
