<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1a1a2e; background: #fff; }

    .header { background: #059669; color: #fff; padding: 18px 24px; margin-bottom: 20px; }
    .header h1 { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
    .header .sub { font-size: 11px; margin-top: 4px; opacity: 0.85; }
    .header .meta { float: right; text-align: right; font-size: 10px; }

    .summary-grid { display: table; width: 100%; margin-bottom: 20px; border-collapse: separate; border-spacing: 6px; }
    .summary-cell { display: table-cell; width: 20%; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 12px; text-align: center; }
    .summary-cell .num { font-size: 22px; font-weight: bold; color: #059669; }
    .summary-cell .label { font-size: 9px; color: #6b7280; text-transform: uppercase; margin-top: 2px; }

    .section-title { font-size: 12px; font-weight: bold; color: #059669; border-bottom: 2px solid #059669; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
    thead tr { background: #059669; color: #fff; }
    thead th { padding: 7px 8px; text-align: left; font-weight: 600; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody tr:hover { background: #f0fdf4; }
    tbody td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }

    .badge { display: inline-block; padding: 2px 6px; border-radius: 10px; font-size: 9px; font-weight: bold; }
    .badge-green  { background: #d1fae5; color: #065f46; }
    .badge-yellow { background: #fef3c7; color: #92400e; }
    .badge-red    { background: #fee2e2; color: #991b1b; }

    .rate-bar-wrap { background: #e5e7eb; border-radius: 4px; height: 6px; width: 80px; display: inline-block; vertical-align: middle; }
    .rate-bar { background: #059669; border-radius: 4px; height: 6px; }

    .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 9px; color: #9ca3af; display: flex; justify-content: space-between; }

    .info-block { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 16px; }
    .info-row { display: table; width: 100%; }
    .info-item { display: table-cell; width: 33%; }
    .info-item .key { color: #6b7280; font-size: 9px; text-transform: uppercase; }
    .info-item .val { font-weight: bold; font-size: 12px; margin-top: 2px; }
</style>
</head>
<body>

<div class="header">
    <div class="meta">
        Généré le {{ now()->format('d/m/Y à H:i') }}<br>
        {{ $company->name }}
    </div>
    <h1>PointPro — Rapport Mensuel</h1>
    <div class="sub">{{ ucfirst($report['month_name']) }} &bull; {{ $report['total_workdays'] }} jours ouvrés</div>
</div>

{{-- Résumé --}}
<div class="summary-grid">
    <div class="summary-cell">
        <div class="num">{{ $report['summary']['present'] }}</div>
        <div class="label">Présences</div>
    </div>
    <div class="summary-cell">
        <div class="num">{{ $report['summary']['late'] }}</div>
        <div class="label">Retards</div>
    </div>
    <div class="summary-cell">
        <div class="num">{{ $report['summary']['absent'] }}</div>
        <div class="label">Absences</div>
    </div>
    <div class="summary-cell">
        <div class="num">{{ $report['avg_worked_hours'] }}h</div>
        <div class="label">Moy. heures/j</div>
    </div>
    <div class="summary-cell">
        <div class="num">{{ $report['total_overtime'] }}h</div>
        <div class="label">Heures sup.</div>
    </div>
</div>

{{-- Tableau des employés --}}
<div class="section-title">Détail par employé</div>
<table>
    <thead>
        <tr>
            <th>Employé</th>
            <th>Département</th>
            <th style="text-align:center">Présents</th>
            <th style="text-align:center">Retards</th>
            <th style="text-align:center">Absents</th>
            <th style="text-align:center">Heures</th>
            <th style="text-align:center">H.Sup</th>
            <th style="text-align:center">Taux</th>
        </tr>
    </thead>
    <tbody>
        @foreach($employees as $emp)
        <tr>
            <td><strong>{{ $emp['full_name'] }}</strong></td>
            <td>{{ $emp['department'] ?? '—' }}</td>
            <td style="text-align:center">
                <span class="badge badge-green">{{ $emp['present_count'] }}</span>
            </td>
            <td style="text-align:center">
                @if($emp['late_count'] > 0)
                    <span class="badge badge-yellow">{{ $emp['late_count'] }}</span>
                @else
                    <span style="color:#9ca3af">0</span>
                @endif
            </td>
            <td style="text-align:center">
                @if($emp['absent_count'] > 0)
                    <span class="badge badge-red">{{ $emp['absent_count'] }}</span>
                @else
                    <span style="color:#9ca3af">0</span>
                @endif
            </td>
            <td style="text-align:center">{{ $emp['total_hours'] }}h</td>
            <td style="text-align:center">{{ $emp['overtime_hours'] }}h</td>
            <td style="text-align:center">
                <div class="rate-bar-wrap">
                    <div class="rate-bar" style="width:{{ $emp['attendance_rate'] }}%"></div>
                </div>
                {{ $emp['attendance_rate'] }}%
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    <span>PointPro — Solution SaaS de gestion de présence</span>
    <span>{{ $company->name }} &bull; {{ ucfirst($report['month_name']) }}</span>
    <span>Document confidentiel</span>
</div>

</body>
</html>
