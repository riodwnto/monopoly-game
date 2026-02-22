<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // Pastikan hanya role 'admin' yang bisa buka halaman ini
        if ($request->user()->role !== 'admin') {
            abort(403, 'Hanya Admin yang boleh mengakses halaman ini.');
        }

        // Ambil semua data pemain (selain admin) untuk ditampilkan di tabel
        $players = User::where('role', 'player')->latest()->get();

        return Inertia::render('AdminDashboard', [
            'players' => $players
        ]);
    }

    public function store(Request $request)
    {
        // Validasi inputan admin
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'whatsapp' => 'required|string|max:20',
        ]);

        // Buat PIN acak 6 digit
        $pin = mt_rand(100000, 999999);

        // Simpan pemain ke database
        $user = User::create([
            'name' => 'Player ' . rand(10, 99),
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'password' => Hash::make((string)$pin), // Tetap di-hash untuk sistem login
            'role' => 'player',
            'pin' => $pin, // Simpan PIN aslinya agar bisa dilihat Admin
        ]);

        // TODO: Nanti kita letakkan kode untuk mengirim WA lewat API di sini

        // Kembalikan ke halaman dashboard dengan pesan sukses dan PIN yang baru dibuat
        return redirect()->back()->with('success', 'Pemain berhasil didaftarkan! PIN: ' . $pin);
    }

    public function destroy(Request $request, $id)
    {
        // Pastikan hanya admin yang bisa menghapus
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Cari pemain berdasarkan ID, lalu hapus
        $player = User::findOrFail($id);
        $player->delete();

        // Kembalikan ke halaman dashboard dengan pesan sukses
        return redirect()->back()->with('success', 'Pemain berhasil dihapus!');
    }
}