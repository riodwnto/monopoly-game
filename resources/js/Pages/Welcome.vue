<script setup>
import { useGameLogic } from '../Composables/useGameLogic';
import PlayerCard from '../Components/PlayerCard.vue';
import DicePanel from '../Components/DicePanel.vue';
import BoardCell from '../Components/BoardCell.vue';
import BuyModal from '../Components/BuyModal.vue';
import RentModal from '../Components/RentModal.vue';
import EventModal from '../Components/EventModal.vue';

const { 
  currentTurn, dice, isRolling, hasRolled, players, boardCells,
  showBuyModal, currentProperty, buyProperty, skipProperty,
  showRentModal, rentDetails, payRent,
  showEventModal, eventDetails, closeEvent,
  gameLogs, isGameOver, winner, rollDice, endTurn, resetGame
} = useGameLogic();
</script>

<template>
  <div class="game-wrapper">
    <div class="main-layout">
      
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
          <button class="btn-end" @click="endTurn" :disabled="!hasRolled || isRolling || isGameOver">SELESAI</button>
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

    <BuyModal :show="showBuyModal" :property="currentProperty" :player="players.find(p => p.id === currentTurn)" @buy="buyProperty" @skip="skipProperty" />
    <RentModal :show="showRentModal" :details="rentDetails" @pay="payRent" />
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
:global(body) { margin: 0; background: #0b3d4a; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
.game-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.main-layout { display: flex; gap: 30px; align-items: flex-start; }

/* Board Section Minimalis */
.board-container { display: flex; flex-direction: column; align-items: center; }
.monopoly-board { 
  display: grid; grid-template-columns: repeat(11, 1fr); grid-template-rows: repeat(11, 1fr); 
  width: 85vmin; height: 85vmin; max-width: 650px; max-height: 650px; 
  background: #c7f9cc; border: 2px solid #1a1a1a; position: relative;
  box-shadow: none; /* Menghapus shadow papan */
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

/* Tombol Flat Design - Tanpa Shadow & Transform */
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