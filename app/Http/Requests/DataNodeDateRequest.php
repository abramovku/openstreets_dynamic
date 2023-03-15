<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DataNodeDateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'node_id' => 'required|array',
            'date_start' => 'required|string',
            'date_end' => 'required|string',
            'limit' => 'sometimes|required|integer',
        ];
    }
}
