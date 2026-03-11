<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Votre espace PointPro est prêt</title></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0D1117;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:30px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#10B981;font-size:22px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:30px 24px;">
        <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">Votre espace entreprise est prêt</h2>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0 0 20px;">
            Bonjour,<br><br>
            @if($subscriptionDirect)
                Votre demande de devis a été traitée. Un espace PointPro avec <strong style="color:#10B981;">abonnement actif</strong> a été créé pour <strong style="color:#E5E7EB;">{{ $company->name }}</strong>. Vous pouvez vous connecter et utiliser le service immédiatement.
            @else
                Votre demande de devis a été traitée. Un espace PointPro en <strong style="color:#10B981;">démo {{ $trialDays }} jours</strong> a été créé pour <strong style="color:#E5E7EB;">{{ $company->name }}</strong>. À l'issue de la démo, vous pourrez finaliser votre inscription et choisir votre offre pour continuer.
            @endif
        </p>
        <table width="100%" style="margin:16px 0;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;">Connexion</td>
                <td style="padding:10px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ $company->email }}</td></tr>
            <tr><td style="padding:10px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Mot de passe temporaire</td>
                <td style="padding:10px 16px;color:#10B981;font-size:13px;text-align:right;font-family:monospace;">{{ $temporaryPassword }}</td></tr>
        </table>
        <p style="color:#9CA3AF;font-size:13px;margin:0 0 20px;">
            Nous vous recommandons de modifier ce mot de passe après votre première connexion (Profil → Mot de passe).
        </p>
        <div style="text-align:center;margin:24px 0;">
            <a href="{{ config('app.url') }}/login" style="display:inline-block;padding:12px 28px;background:#10B981;color:#fff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">Se connecter</a>
        </div>
    </td></tr>
    <tr><td style="padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#4B5563;font-size:11px;margin:0;">© {{ date('Y') }} PointPro</p>
    </td></tr>
</table>
</body>
</html>
