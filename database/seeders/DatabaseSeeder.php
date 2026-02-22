<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat akun Admin
        User::updateOrCreate(
            ['email' => 'admin@monopoli.com'], // Email Admin kamu
            [
                'name' => 'Super Admin',
                'password' => Hash::make('P@ssw0rd123!'), // Password Admin kamu
                'role' => 'admin',
                'whatsapp' => '087830281137'
            ]
        );
    }
}