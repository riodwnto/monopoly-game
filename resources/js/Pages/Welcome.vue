<script setup>
import { useGameLogic } from '../Composables/useGameLogic';
import PlayerCard from '../Components/PlayerCard.vue';
import DicePanel from '../Components/DicePanel.vue';
import BoardCell from '../Components/BoardCell.vue';
import BuyModal from '../Components/BuyModal.vue';
import RentModal from '../Components/RentModal.vue';
import EventModal from '../Components/EventModal.vue';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import axios from 'axios';

const page = usePage();
const currentUser = computed(() => page.props.auth.user);

const {
  currentTurn, dice, isRolling, hasRolled, players, boardCells,
  showBuyModal, currentProperty, buyProperty, skipProperty,
  showRentModal, rentDetails, payRent,
  showEventModal, eventDetails, closeEvent,
  gameLogs, isGameOver, winner, rollDice, endTurn, resetGame
} = useGameLogic();

// =========================================================
// FITUR AUTO SAVE & LOAD
// =========================================================

const triggerAutoSave = () => {
    const stateToSave = {
        currentTurn: currentTurn.value,
        players: players.value,
        boardCells: boardCells.value,
        gameLogs: gameLogs.value
    };

    axios.post(route('game.autosave'), { state: stateToSave })
        .then(() => console.log("✅ Auto-save di background berhasil!"))
        .catch(e => console.error("❌ Auto-save gagal:", e));
};

const handleLoadGame = () => {
    axios.get(route('game.load'))
        .then(response => {
            if (response.data.state) {
                const savedState = response.data.state;
                currentTurn.value = savedState.currentTurn;
                players.value = savedState.players;
                if(savedState.boardCells) boardCells.value = savedState.boardCells;
                if(savedState.gameLogs) gameLogs.value = savedState.gameLogs;
                alert("🎮 Game berhasil dilanjutkan dari posisi terakhir!");
            } else {
                alert("Kamu belum punya data save sebelumnya. Mulai permainan baru!");
            }
        })
        .catch(error => {
            console.error("Gagal load game:", error);
            alert("Terjadi kesalahan saat memuat data.");
        });
};

const handleEndTurn = () => {
    endTurn();
    triggerAutoSave();
};

const handleBuyProperty = (...args) => {
    buyProperty(...args);
    triggerAutoSave();
};

const handlePayRent = (...args) => {
    payRent(...args);
    triggerAutoSave();
};
</script>

<template>
  <div class="game-wrapper">
    <div class="game-vertical-container">

        <div class="header-bar bg-indigo-900 text-white p-3 flex justify-between items-center shadow-md rounded-t-lg border-b border-indigo-700">
            <div class="font-semibold flex items-center">
                <span class="text-2xl mr-2">👤</span>
                <div>
                    Draft Akun: <span class="text-yellow-300 font-bold">{{ currentUser.name }}</span>
                    <div class="text-xs text-indigo-300">({{ currentUser.email }})</div>
                </div>
            </div>

            <button @click="handleLoadGame" class="load-button bg-yellow-500 text-indigo-900 px-4 py-2 rounded-md font-bold hover:bg-yellow-400 transition shadow-sm text-sm flex items-center gap-2">
                <span>🔄</span> LOAD GAME TERAKHIR
            </button>
        </div>

        <div class="main-layout bg-white bg-opacity-5 p-6 rounded-b-lg backdrop-blur-sm border border-white border-opacity-10">

          <section class="board-container">
            <header class="scoreboard">
              <PlayerCard
                v-for="p in players"
                :key="p.id"
                :player="p"
                :isActive="currentTurn === p.id"
                :class="{ 'active-flat': currentTurn === p.id }"
              />
            </header>

            <main class="monopoly-board">
              <DicePanel :dice="dice" :isRolling="isRolling" />
              <BoardCell
                v-for="cell in boardCells"
                :key="cell.id"
                :cell="cell"
                :players="players"
              />
            </main>

            <footer class="controls">
              <button class="btn-roll" @click="rollDice" :disabled="hasRolled || isRolling || isGameOver">
                {{ isRolling ? '🎲...' : 'LEMPAR DADU' }}
              </button>
              <button class="btn-end" @click="handleEndTurn" :disabled="!hasRolled || isRolling || isGameOver">
                SELESAI
              </button>
              <button class="btn-reset" @click="resetGame">🔄</button>
            </footer>
          </section>

          <aside class="log-panel">
            <div class="log-header">📜 AKTIVITAS</div>
            <div class="log-body">
              <div v-for="(log, i) in gameLogs" :key="i" class="log-item">
                {{ log }}
              </div>
            </div>
          </aside>
        </div>

    </div>

    <BuyModal :show="showBuyModal" :property="currentProperty" :player="players.find(p => p.id === currentTurn)" @buy="handleBuyProperty" @skip="skipProperty" />
    <RentModal :show="showRentModal" :details="rentDetails" @pay="handlePayRent" />
    <EventModal :show="showEventModal" :details="eventDetails" @close="closeEvent" />

    <div v-if="isGameOver" class="game-over-overlay">
      <div class="winner-card">
        <h1>🏆 SELESAI</h1>
        <p>Pemenang: <strong>{{ winner?.name }}</strong></p>
        <button @click="resetGame" class="btn-restart">MAIN LAGI</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(body) { margin: 0; background: #0b3d4a; font-family: 'Segoe UI', sans-serif; overflow: auto; }

/* Wrapper utama untuk menengahkan secara vertikal dan horizontal */
.game-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 30px 0; /* Beri jarak atas bawah */
}

/* Container baru untuk menumpuk header dan game */
.game-vertical-container {
  display: flex;
  flex-direction: column;
  width: auto; /* Lebar menyesuaikan konten di dalamnya */
  max-width: 1000px; /* Batas maksimal lebar agar tidak terlalu lebar di layar besar */
}

/* Header Bar */
.header-bar {
    /* Style sudah di-handle oleh Tailwind classes di template */
}

/* Perbaikan untuk Tombol Load */
.load-button {
    flex: initial !important; /* Mencegah tombol tertarik (stretch) */
    width: auto !important; /* Lebar sesuai teks */
    margin: 0; /* Reset margin */
}

/* Layout utama game (kiri board, kanan log) */
.main-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  /* Style background dll sudah di-handle Tailwind di template */
}

/* Board Section Minimalis */
.board-container { display: flex; flex-direction: column; align-items: center; }
.monopoly-board {
  display: grid; grid-template-columns: repeat(11, 1fr); grid-template-rows: repeat(11, 1fr);
  width: 85vmin; height: 85vmin; max-width: 650px; max-height: 650px;
  background: #c7f9cc; border: 2px solid #1a1a1a; position: relative;
  box-shadow: none;
}

/* Sidebar Aktivitas Flat */
.log-panel {
  width: 280px; height: 740px; background: rgba(0,0,0,0.2);
  border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column;
}
.log-header { padding: 15px; color: #ffb703; font-weight: bold; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
.log-body { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 8px; }
.log-item { color: #eee; font-size: 0.8rem; padding: 8px; border-left: 2px solid #ffb703; background: rgba(255,255,255,0.03); }

/* Score & Controls */
.scoreboard { display: flex; gap: 10px; width: 100%; margin-bottom: 15px; }
.controls { display: flex; gap: 10px; width: 100%; margin-top: 15px; }

/* Indikator Aktif Flat */
.active-flat { border: 2px solid #ffb703; border-radius: 4px; background: rgba(255,183,3,0.1); }

/* Tombol Flat Design Umum (untuk kontrol game) */
button {
  flex: 1; padding: 14px; border: none; font-weight: bold;
  cursor: pointer; border-radius: 4px; transition: background 0.2s;
  font-size: 0.9rem; text-transform: uppercase;
}
button:hover:not(:disabled) { filter: brightness(1.1); }
button:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-roll { background: #ffb703; color: #0b3d4a; }
.btn-end { background: #8ecae6; color: #0b3d4a; }
.btn-reset { flex: 0 0 50px; background: #e63946; color: white; }

/* Game Over Card Flat */
.game-over-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 5000; }
.winner-card { background: white; padding: 40px; border-radius: 4px; text-align: center; border: 4px solid #ffb703; color: #333; }
.btn-restart { background: #0b3d4a; color: white; margin-top: 20px; width: 100%; }
</style>