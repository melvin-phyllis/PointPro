<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Réponse à votre ticket</title></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0D1117;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:30px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#10B981;font-size:22px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:30px 24px;">
        <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">💬 Réponse à votre ticket</h2>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">
            Une nouvelle réponse a été ajoutée à votre ticket <strong style="color:#10B981;">#{{ $ticket->ticket_number }}</strong> : <em style="color:#E5E7EB;">{{ $ticket->subject }}</em>
        </p>
        <div style="margin:20px 0;padding:16px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);border-radius:8px;">
            <p style="color:#9CA3AF;font-size:12px;margin:0 0 8px;">{{ $message->user?->full_name ?? 'Équipe PointPro' }}</p>
            <p style="color:#D1D5DB;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">{{ $message->body }}</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
            <a href="{{ config('app.url') }}/support/{{ $ticket->id }}" style="display:inline-block;padding:12px 28px;background:#10B981;color:#fff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">Répondre</a>
        </div>
    </td></tr>
    <tr><td style="padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#4B5563;font-size:11px;margin:0;">© {{ date('Y') }} PointPro</p>
    </td></tr>
</table>
</body>
</html>
