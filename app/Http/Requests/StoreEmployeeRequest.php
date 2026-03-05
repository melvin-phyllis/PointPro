<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'first_name'         => 'required|string|max:100',
            'last_name'          => 'required|string|max:100',
            'email'              => [
                'required', 'email',
                // Email unique dans la même company
                Rule::unique('users')->where(fn($q) => $q->where('company_id', auth()->user()->company_id)),
            ],
            'department_id'      => 'nullable|exists:departments,id',
            'role'               => 'required|in:employee,manager',
            'phone'              => 'nullable|string|max:50',
            'employee_id_number' => 'nullable|string|max:50',
            'location_id'        => 'nullable|exists:locations,id',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required'  => 'Le nom est obligatoire.',
            'email.required'      => 'L\'adresse e-mail est obligatoire.',
            'email.unique'        => 'Cette adresse e-mail est déjà utilisée.',
            'role.required'       => 'Le rôle est obligatoire.',
            'role.in'             => 'Le rôle doit être employé ou manager.',
        ];
    }
}
