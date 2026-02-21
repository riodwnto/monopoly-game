<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ini memerintahkan Laravel: "Kalau ada yang buka halaman utama (/), 
// tolong tampilkan komponen Vue bernama 'Welcome'"
Route::get('/', function () {
    return Inertia::render('Welcome');
});