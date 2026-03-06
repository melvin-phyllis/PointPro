<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Facture</title></head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0D1117;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:30px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="color:#10B981;font-size:22px;margin:0;">PointPro</h1>
    </td></tr>
    <tr><td style="padding:30px 24px;">
        <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">📄 Facture {{ $invoice->invoice_number }}</h2>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;">Bonjour <strong style="color:#E5E7EB;">{{ $company->name }}</strong>,<br>Voici votre facture :</p>
        <table width="100%" style="margin:20px 0;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;">N° de facture</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ $invoice->invoice_number }}</td></tr>
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Montant HT</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ number_format($invoice->amount) }} FCFA</td></tr>
            @if($invoice->tax_amount > 0)
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">TVA</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;">{{ number_format($invoice->tax_amount) }} FCFA</td></tr>
            @endif
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;font-weight:bold;border-top:1px solid rgba(255,255,255,0.1);">Total TTC</td>
                <td style="padding:12px 16px;color:#10B981;font-size:16px;font-weight:bold;text-align:right;border-top:1px solid rgba(255,255,255,0.1);">{{ number_format($invoice->total_amount) }} FCFA</td></tr>
            <tr><td style="padding:12px 16px;color:#9CA3AF;font-size:13px;border-top:1px solid rgba(255,255,255,0.05);">Échéance</td>
                <td style="padding:12px 16px;color:#E5E7EB;font-size:13px;text-align:right;border-top:1px solid rgba(255,255,255,0.05);">{{ $invoice->due_date->format('d/m/Y') }}</td></tr>
        </table>
        @if($invoice->description)
        <p style="color:#9CA3AF;font-size:13px;">{{ $invoice->description }}</p>
        @endif
    </td></tr>
    <tr><td style="padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
        <p style="color:#4B5563;font-size:11px;margin:0;">© {{ date('Y') }} PointPro</p>
    </td></tr>
</table>
</body>
</html>
