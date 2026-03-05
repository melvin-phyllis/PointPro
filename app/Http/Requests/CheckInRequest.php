<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ];
    }

    public function messages(): array
    {
        return [
            'latitude.required'  => 'La latitude est requise.',
            'latitude.between'   => 'La latitude doit être entre -90 et 90.',
            'longitude.required' => 'La longitude est requise.',
            'longitude.between'  => 'La longitude doit être entre -180 et 180.',
        ];
    }
}
