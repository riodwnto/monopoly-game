<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GameController;

// 1. Rute Default (Arahkan langsung ke halaman Login jika belum punya sesi)
Route::get('/', function () {
    // Jika user SUDAH login
    if (auth()->check()) {
        // Cek apakah dia admin atau player
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('game');
    }
    
    // Jika BELUM login, arahkan ke halaman masuk
    return redirect()->route('login');
});

// 2. Rute Tampilan Papan Game
Route::get('/game', function () {
    return Inertia::render('Welcome');
})->middleware(['auth', 'verified'])->name('game');

// ==========================================================
// 3. GRUP RUTE YANG MEMBUTUHKAN LOGIN (MIDDLEWARE AUTH)
// ==========================================================
Route::middleware('auth')->group(function () {
    
    // --- Rute Khusus Admin ---
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/admin/players', [AdminController::class, 'store'])->name('admin.players.store');
    Route::delete('/admin/players/{id}', [AdminController::class, 'destroy'])->name('admin.players.destroy');

    // --- Rute Khusus Sistem Save & Load Game ---
    Route::post('/game/auto-save', [GameController::class, 'autoSave'])->name('game.autosave');
    Route::get('/game/load', [GameController::class, 'loadGame'])->name('game.load');

    // --- Rute Bawaan Laravel Breeze (Profile) ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';