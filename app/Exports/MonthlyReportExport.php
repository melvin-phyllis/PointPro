<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Collection;

class MonthlyReportExport implements
    FromCollection,
    WithHeadings,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    public function __construct(
        private Collection $employees,
        private array      $report,
        private string     $companyName
    ) {}

    public function collection(): Collection
    {
        return $this->employees->map(fn($emp) => [
            $emp['full_name'],
            $emp['department'] ?? '—',
            $emp['present_count'],
            $emp['late_count'],
            $emp['absent_count'],
            $emp['total_hours'],
            $emp['overtime_hours'],
            $emp['total_late_min'],
            $emp['attendance_rate'] . '%',
        ]);
    }

    public function headings(): array
    {
        return [
            'Nom complet',
            'Département',
            'Jours présents',
            'Jours en retard',
            'Jours absents',
            'Heures travaillées',
            'Heures supplémentaires',
            'Minutes de retard',
            'Taux de présence',
        ];
    }

    public function title(): string
    {
        return ucfirst($this->report['month_name']);
    }

    public function styles(Worksheet $sheet): array
    {
        // Ligne d'info entreprise (ligne 1)
        $sheet->insertNewRowBefore(1, 2);
        $sheet->setCellValue('A1', $this->companyName . ' — Rapport de présence');
        $sheet->setCellValue('A2', ucfirst($this->report['month_name']) . ' · ' . $this->report['total_workdays'] . ' jours ouvrés');

        $lastRow = $this->employees->count() + 3; // +2 lignes info + 1 en-tête

        return [
            // Titre
            1 => [
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '059669']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT],
            ],
            2 => [
                'font' => ['size' => 10, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '059669']],
            ],
            // En-têtes colonnes
            3 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '10b981']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }
}
