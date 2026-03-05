<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name'                              => 'required|string|max:255',
            'email'                             => 'required|email',
            'phone'                             => 'nullable|string|max:50',
            'address'                           => 'nullable|string',
            'settings.work_start'               => 'required|date_format:H:i',
            'settings.work_end'                 => 'required|date_format:H:i|after:settings.work_start',
            'settings.late_tolerance_minutes'   => 'required|integer|min:0|max:120',
            'settings.early_check_in_minutes'   => 'required|integer|min:0|max:120',
            'settings.auto_absent_after_minutes'=> 'required|integer|min:30|max:480',
            'settings.lunch_break_minutes'      => 'required|integer|min:0|max:120',
            'settings.timezone'                 => 'required|string|timezone',
            'settings.working_days'             => 'required|array|min:1',
            'settings.working_days.*'           => 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'                               => 'Le nom de l\'entreprise est obligatoire.',
            'email.required'                              => 'L\'adresse e-mail est obligatoire.',
            'settings.work_start.required'                => 'L\'heure de début de travail est obligatoire.',
            'settings.work_end.required'                  => 'L\'heure de fin de travail est obligatoire.',
            'settings.work_end.after'                     => 'L\'heure de fin doit être après l\'heure de début.',
            'settings.late_tolerance_minutes.required'    => 'La tolérance de retard est obligatoire.',
            'settings.auto_absent_after_minutes.required' => 'Le délai d\'absence automatique est obligatoire.',
        ];
    }
}
