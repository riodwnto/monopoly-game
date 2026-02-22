<?php

namespace App\Http\Controllers;

use App\Models\GameSave;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // Fungsi untuk menyimpan diam-diam (Auto-Save)
    public function autoSave(Request $request)
    {
        GameSave::updateOrCreate(
            ['user_id' => auth()->id()], // Cari save data milik user ini
            ['game_state' => $request->state] // Update atau buat baru dengan data game terbaru
        );

        return response()->json(['status' => 'success']);
    }

    // Fungsi untuk mengambil data (Load)
    public function loadGame()
    {
        $save = GameSave::where('user_id', auth()->id())->first();

        return response()->json([
            'state' => $save ? $save->game_state : null
        ]);
    }
}