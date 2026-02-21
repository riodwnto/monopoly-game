<script setup>
const props = defineProps({
  cell: Object,
  players: Array
});

// Fungsi untuk mendapatkan warna pemain yang memiliki tanah ini
const getOwnerColor = () => {
  if (!props.cell.ownerId) return null;
  
  const owner = props.players.find(p => p.id === props.cell.ownerId);
  return owner ? owner.colorHex : null;
};
</script>

<template>
  <div class="board-cell" :style="{ gridRow: cell.row, gridColumn: cell.col }">
    <div v-if="cell.color" class="cell-color-bar" :style="{ backgroundColor: cell.color }"></div>
    
    <div class="special-content">
      <div v-if="cell.name === 'Kesempatan'" class="special-icon color-pink">?</div>
      <div v-else-if="cell.name.includes('Dana Umum')" class="special-icon">📦</div>
      <div v-else-if="cell.name.includes('Stasiun')" class="special-icon">🚂</div>
      <div v-else-if="cell.name === 'PLN'" class="special-icon color-yellow">⚡</div>
      <div v-else-if="cell.name === 'PDAM'" class="special-icon color-blue">💧</div>
      <div v-else-if="cell.name === 'KE\nPENJARA'" class="special-icon">👮</div>
      <div v-else-if="cell.name === 'PENJARA'" class="special-icon">🔒</div>
      <div v-else-if="cell.name === 'START'" class="special-icon color-red">🚀</div>
      <div v-else-if="cell.name.includes('Pajak')" class="special-icon">💎</div>
    </div>

    <span class="cell-text">{{ cell.name }}</span>

    <div 
      v-if="cell.ownerId" 
      class="owner-indicator" 
      :style="{ backgroundColor: getOwnerColor() }"
    ></div>

    <div class="player-tokens-container">
      <div 
        v-for="player in players.filter(p => p.position === cell.id)" 
        :key="player.id"
        class="token"
        :style="{ backgroundColor: player.colorHex }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.board-cell { 
  background-color: white; 
  border: 1px solid #333; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: flex-start; 
  text-align: center; 
  position: relative; 
  overflow: hidden; 
}

.cell-color-bar { 
  width: 100%; 
  height: 25%; 
  border-bottom: 1px solid #333; 
}

.special-content {
  margin-top: 2px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.special-icon {
  font-size: 1.1rem;
}

.cell-text { 
  font-size: 0.5rem; 
  font-weight: bold; 
  white-space: pre-line; 
  margin-top: 2px; 
  padding: 0 2px; 
  z-index: 2; 
  line-height: 1.2;
}

/* Warna khusus ikon */
.color-pink { color: #ff006e; font-weight: bold; }
.color-yellow { color: #ffb703; }
.color-blue { color: #219ebc; }
.color-red { color: #e63946; }

.owner-indicator {
  width: 80%;
  height: 5px;
  border-radius: 10px;
  margin-top: auto;
  margin-bottom: 18px; /* Memberi ruang untuk bidak di bawahnya */
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  z-index: 2;
}

.player-tokens-container { 
  display: flex; 
  gap: 2px; 
  position: absolute; 
  bottom: 3px; 
  z-index: 3; 
  justify-content: center;
  width: 100%;
}

.token { 
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  border: 1px solid white; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.4); 
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
</style>