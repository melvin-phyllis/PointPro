<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Collection;

class AttendancePeriodExport implements
    FromCollection,
    WithHeadings,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    public function __construct(
        private Collection $rows,
        private string     $companyName,
        private string     $dateFrom,
        private string     $dateTo
    ) {}

    public function collection(): Collection
    {
        return $this->rows->map(fn($r) => [
            $r['date'],
            $r['employee'],
            $r['department'],
            $r['check_in'],
            $r['check_out'],
            $r['worked_hours'],
            $r['location'],
            $r['status'],
            $r['late_minutes'],
        ]);
    }

    public function headings(): array
    {
        return [
            'Date',
            'Employé',
            'Département',
            'Arrivée',
            'Départ',
            'Durée',
            'Lieu',
            'Statut',
            'Retard (min)',
        ];
    }

    public function title(): string
    {
        return 'Présences';
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->insertNewRowBefore(1, 2);
        $sheet->setCellValue('A1', $this->companyName . ' — Historique des présences');
        $sheet->setCellValue('A2', 'Du ' . $this->dateFrom . ' au ' . $this->dateTo);

        return [
            1 => [
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '059669']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT],
            ],
            2 => [
                'font' => ['size' => 10, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '059669']],
            ],
            3 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '10b981']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }
}
