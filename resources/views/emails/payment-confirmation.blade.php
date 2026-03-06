<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Confirmation de paiement</title></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0D1117;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:30px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#10B981;font-size:22px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:30px 24px;">
        <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">Paiement confirmé ✅</h2>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">Bonjour,<br>Nous confirmons la réception de votre paiement :</p>
        <table width="100%" style="margin:20px 0;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;">Entreprise</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ $company->name }}</td></tr>
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Montant</td>
                <td style="padding:12px 16px;color:#10B981;font-size:15px;font-weight:bold;text-align:right;border-top:1px solid rgba(255,255,255,0.05);">{{ number_format($payment->amount) }} FCFA</td></tr>
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Méthode</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;border-top:1px solid rgba(255,255,255,0.05);">{{ $payment->payment_method }}</td></tr>
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Date</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;border-top:1px solid rgba(255,255,255,0.05);">{{ $payment->paid_at?->format('d/m/Y H:i') ?? $payment->created_at->format('d/m/Y H:i') }}</td></tr>
        </table>
        <p style="color:#6B7280;font-size:12px;">Merci pour votre confiance.</p>
    </td></tr>
    <tr><td style="padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#4B5563;font-size:11px;margin:0;">© {{ date('Y') }} PointPro — Tous droits réservés</p>
    </td></tr>
</table>
</body>
</html>
