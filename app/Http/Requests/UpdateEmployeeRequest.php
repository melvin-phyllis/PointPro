<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        $userId = $this->route('employe')?->id ?? $this->route('employe');

        return [
            'first_name'         => 'required|string|max:100',
            'last_name'          => 'required|string|max:100',
            'email'              => [
                'required', 'email',
                Rule::unique('users')
                    ->where(fn($q) => $q->where('company_id', auth()->user()->company_id))
                    ->ignore($userId),
            ],
            'password'           => ['nullable', Password::min(8)->letters()->numbers()],
            'department_id'      => 'nullable|exists:departments,id',
            'role'               => 'required|in:employee,manager,admin',
            'phone'              => 'nullable|string|max:50',
            'employee_id_number' => 'nullable|string|max:50',
            'location_id'        => 'nullable|exists:locations,id',
            'is_active'          => 'boolean',
        ];
    }
}
