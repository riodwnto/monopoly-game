<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSave extends Model
{
    protected $fillable = ['user_id', 'game_state'];

    // Beri tahu Laravel bahwa 'game_state' itu bentuknya JSON/Array, bukan teks biasa
    protected $casts = [
        'game_state' => 'array',
    ];
}