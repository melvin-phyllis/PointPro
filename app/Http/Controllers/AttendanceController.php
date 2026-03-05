<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckInRequest;
use App\Models\Attendance;
use App\Services\AttendanceService;
use Exception;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceService $attendanceService) {}

    /**
     * Page principale de pointage.
     */
    public function index(): Response
    {
        $user  = auth()->user();
        $today = today()->toDateString();

        // Pointage du jour
        $todayAttendance = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->where('date', $today)
            ->with(['checkInLocation', 'checkOutLocation'])
            ->first();

        // Historique des 7 derniers jours
        $history = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->where('date', '<', $today)
            ->orderByDesc('date')
            ->limit(7)
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'date'           => $a->date->format('d/m/Y'),
                'day_name'       => $a->date->locale('fr')->isoFormat('ddd'),
                'check_in'       => $a->check_in?->format('H:i'),
                'check_out'      => $a->check_out?->format('H:i'),
                'status'         => $a->status,
                'worked_hours'   => $a->worked_duration,
                'late_minutes'   => $a->late_minutes,
                'location_name'  => $a->checkInLocation?->name,
            ]);

        return Inertia::render('Pointage/Index', [
            'todayAttendance' => $todayAttendance ? [
                'id'               => $todayAttendance->id,
                'check_in'         => $todayAttendance->check_in?->format('H:i'),
                'check_out'        => $todayAttendance->check_out?->format('H:i'),
                'status'           => $todayAttendance->status,
                'late_minutes'     => $todayAttendance->late_minutes,
                'worked_hours'     => $todayAttendance->worked_duration,
                'is_geo_verified'  => $todayAttendance->is_geo_verified,
                'location_name'    => $todayAttendance->checkInLocation?->name,
            ] : null,
            'history'         => $history,
        ]);
    }

    /**
     * Enregistrer l'arrivée.
     */
    public function checkIn(CheckInRequest $request)
    {
        try {
            $attendance = $this->attendanceService->checkIn(
                auth()->user(),
                $request->float('latitude'),
                $request->float('longitude')
            );

            return back()->with('success', 'Arrivée pointée à ' . $attendance->check_in->format('H:i') . '.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Enregistrer le départ.
     */
    public function checkOut(CheckInRequest $request)
    {
        try {
            $attendance = $this->attendanceService->checkOut(
                auth()->user(),
                $request->float('latitude'),
                $request->float('longitude')
            );

            return back()->with('success', 'Départ pointé à ' . $attendance->check_out->format('H:i') . '. Durée : ' . $attendance->worked_duration . '.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Historique complet des pointages de l'utilisateur.
     */
    public function history(): Response
    {
        $user = auth()->user();

        $attendances = Attendance::withoutGlobalScope('company')
            ->where('user_id', $user->id)
            ->with(['checkInLocation', 'checkOutLocation'])
            ->orderByDesc('date')
            ->paginate(30)
            ->through(fn($a) => [
                'id'             => $a->id,
                'date'           => $a->date->format('d/m/Y'),
                'day_name'       => $a->date->locale('fr')->isoFormat('dddd'),
                'check_in'       => $a->check_in?->format('H:i'),
                'check_out'      => $a->check_out?->format('H:i'),
                'status'         => $a->status,
                'worked_hours'   => $a->worked_duration,
                'late_minutes'   => $a->late_minutes,
                'overtime_hours' => round($a->overtime_hours, 2),
                'is_geo_verified'=> $a->is_geo_verified,
                'location_name'  => $a->checkInLocation?->name,
            ]);

        return Inertia::render('Pointage/Historique', [
            'attendances' => $attendances,
        ]);
    }
}
