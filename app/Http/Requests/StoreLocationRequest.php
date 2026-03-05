<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name'          => 'required|string|max:255',
            'address'       => 'nullable|string',
            'latitude'      => 'required|numeric|between:-90,90',
            'longitude'     => 'required|numeric|between:-180,180',
            'radius_meters' => 'required|integer|min:10|max:10000',
            'is_active'     => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'          => 'Le nom de la zone est obligatoire.',
            'latitude.required'      => 'La latitude est requise.',
            'latitude.between'       => 'La latitude doit être entre -90 et 90.',
            'longitude.required'     => 'La longitude est requise.',
            'longitude.between'      => 'La longitude doit être entre -180 et 180.',
            'radius_meters.required' => 'Le rayon de détection est obligatoire.',
            'radius_meters.min'      => 'Le rayon minimum est de 10 mètres.',
            'radius_meters.max'      => 'Le rayon maximum est de 10 000 mètres.',
        ];
    }
}
