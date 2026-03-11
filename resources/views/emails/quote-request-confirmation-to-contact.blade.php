<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Votre demande de devis a bien été reçue</title></head>
<body style="margin:0;padding:0;background:#f8f9fb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <tr><td style="padding:24px 24px 16px;border-bottom:1px solid #e5e7eb;">
        <h1 style="color:#10B981;font-size:20px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:24px;">
        <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;">Bonjour {{ $quoteRequest->first_name }},</p>
        <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 16px;">
            Nous avons bien reçu votre demande de devis pour <strong>{{ $quoteRequest->company_name }}</strong> (forfait {{ ucfirst($quoteRequest->plan) }}).
        </p>
        <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 24px;">
            Vos informations ont été prises en compte. Un conseiller PointPro vous contactera prochainement pour vous proposer une offre adaptée à vos besoins.
        </p>
        <p style="color:#6b7280;font-size:13px;margin:0;">L'équipe PointPro</p>
    </td></tr>
    <tr><td style="padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:11px;margin:0;">© {{ date('Y') }} PointPro</p>
    </td></tr>
</table>
</body>
</html>
