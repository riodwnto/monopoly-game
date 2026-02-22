<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, usePage, router } from '@inertiajs/vue3';

// Menerima data pemain dari AdminController
defineProps({
    players: Array,
});

// Setup Form untuk mendaftarkan pemain
const form = useForm({
    email: '',
    whatsapp: '',
});

const submit = () => {
    form.post(route('admin.players.store'), {
        preserveScroll: true,
        onSuccess: () => form.reset(), // Kosongkan form setelah sukses
    });
};

const deletePlayer = (id) => {
    if (confirm('Apakah kamu yakin ingin menghapus pemain ini? Akses mereka akan dicabut.')) {
        router.delete(route('admin.players.destroy', id), {
            preserveScroll: true,
        });
    }
};
</script>

<template>
    <Head title="Admin Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">Dashboard Admin - Kelola Pemain</h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                <div v-if="$page.props.flash.success" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 border border-green-300">
                    <span class="font-bold text-lg">🎉 Berhasil!</span> 
                    <p class="mt-1 text-base">{{ $page.props.flash.success }}</p>
                </div>

                <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <section>
                        <header>
                            <h2 class="text-lg font-medium text-gray-900">Daftarkan Pemain Baru</h2>
                            <p class="mt-1 text-sm text-gray-600">
                                Masukkan email dan nomor WA temanmu. Sistem akan otomatis membuatkan PIN rahasia untuk mereka.
                            </p>
                        </header>

                        <form @submit.prevent="submit" class="mt-6 space-y-6">
                            <div>
                                <InputLabel for="email" value="Email Pemain" />
                                <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" required />
                                <InputError class="mt-2" :message="form.errors.email" />
                            </div>

                            <div>
                                <InputLabel for="whatsapp" value="Nomor WhatsApp (Contoh: 08123...)" />
                                <TextInput id="whatsapp" type="text" class="mt-1 block w-full" v-model="form.whatsapp" required />
                                <InputError class="mt-2" :message="form.errors.whatsapp" />
                            </div>

                            <div class="flex items-center gap-4">
                                <PrimaryButton :disabled="form.processing">Daftarkan Pemain</PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>

                <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <h2 class="text-lg font-medium text-gray-900 mb-4">Daftar Pemain Terdaftar</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3">Email</th>
                                    <th class="px-6 py-3">WhatsApp</th>
                                    <th class="px-6 py-3">PIN Akses</th>
                                    <th class="px-6 py-3">Waktu Didaftarkan</th>
                                    <th class="px-6 py-3 text-right">Aksi</th> </tr>
                            </thead>
                            <tbody>
                                <tr v-for="player in players" :key="player.id" class="border-b">
                                    <td class="px-6 py-4 font-medium text-gray-900">{{ player.email }}</td>
                                    <td class="px-6 py-4">{{ player.whatsapp }}</td>
                                    <td class="px-6 py-4 font-bold text-indigo-600">{{ player.pin }}</td>
                                    <td class="px-6 py-4">{{ new Date(player.created_at).toLocaleDateString('id-ID') }}</td>
                                    
                                    <td class="px-6 py-4 text-right">
                                        <button @click="deletePlayer(player.id)" class="text-red-600 hover:text-red-900 font-medium">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="players.length === 0">
                                    <td colspan="5" class="px-6 py-4 text-center">Belum ada pemain yang didaftarkan.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>