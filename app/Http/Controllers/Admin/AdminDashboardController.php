<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\DashboardStatsService;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __construct(private DashboardStatsService $statsService) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->statsService->getGlobalStats(),
        ]);
    }
}
