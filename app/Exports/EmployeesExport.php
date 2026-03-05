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

class EmployeesExport implements
    FromCollection,
    WithHeadings,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    public function __construct(
        private Collection $employees,
        private string     $companyName
    ) {}

    public function collection(): Collection
    {
        return $this->employees->map(fn($e) => [
            $e['employee_id_number'],
            $e['last_name'],
            $e['first_name'],
            $e['email'],
            $e['phone'],
            $e['department'],
            $e['role'],
            $e['location'],
            $e['status'],
        ]);
    }

    public function headings(): array
    {
        return [
            'Matricule',
            'Nom',
            'Prénom',
            'Email',
            'Téléphone',
            'Département',
            'Rôle',
            'Zone GPS',
            'Statut',
        ];
    }

    public function title(): string
    {
        return 'Employés';
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->insertNewRowBefore(1, 2);
        $sheet->setCellValue('A1', $this->companyName . ' — Liste des employés');
        $sheet->setCellValue('A2', 'Exporté le ' . now()->format('d/m/Y à H:i'));

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
