<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Abonnement expire bientôt</title></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0D1117;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:30px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#10B981;font-size:22px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:30px 24px;">
        <h2 style="color:#FBBF24;font-size:18px;margin:0 0 16px;">⚠️ Votre abonnement expire bientôt</h2>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">
            Bonjour,<br>L'abonnement <strong style="color:#E5E7EB;">{{ $plan->name }}</strong> de <strong style="color:#E5E7EB;">{{ $company->name }}</strong> expire dans <strong style="color:#FBBF24;">{{ $days_left }} jour(s)</strong>.
        </p>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">Date d'expiration : <strong style="color:#E5E7EB;">{{ $subscription->ends_at->format('d/m/Y') }}</strong></p>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">Renouvelez votre abonnement pour continuer à utiliser toutes les fonctionnalités de PointPro.</p>
        <div style="text-align:center;margin:24px 0;">
            <a href="{{ config('app.url') }}/subscription" style="display:inline-block;padding:12px 28px;background:#10B981;color:#fff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">Renouveler mon abonnement</a>
        </div>
    </td></tr>
    <tr><td style="padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#4B5563;font-size:11px;margin:0;">© {{ date('Y') }} PointPro</p>
    </td></tr>
</table>
</body>
</html>
