<?php

namespace App\Console\Commands;

use App\Services\AttendanceService;
use Illuminate\Console\Command;

/**
 * Commande : marquer automatiquement les absents.
 * Exécutée quotidiennement via le scheduler Laravel ou un Cron cPanel.
 *
 * Cron cPanel :
 * * * * * * cd /home/user/public_html && php artisan schedule:run >> /dev/null 2>&1
 */
class MarkAbsenteesCommand extends Command
{
    protected $signature   = 'app:mark-absentees';
    protected $description = 'Marquer automatiquement comme absents les employés non pointés après le délai configuré';

    public function __construct(private AttendanceService $attendanceService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Marquage des absents en cours...');

        $this->attendanceService->markAbsentees();

        $this->info('✅ Absents marqués avec succès.');

        return Command::SUCCESS;
    }
}
