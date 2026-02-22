<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_saves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Pemilik Save Data
            $table->json('game_state'); // Kolom ajaib untuk menyimpan SELURUH data Monopoli (uang, posisi, tanah)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_saves');
    }
};