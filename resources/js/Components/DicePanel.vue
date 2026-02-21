<script setup>
defineProps({
  dice: Array,
  isRolling: Boolean // Status apakah dadu sedang berputar
});
</script>

<template>
  <div class="center-area acrylic-panel">
    <h1>MONOPOLI</h1>
    <div class="dice-container">
      <span class="dice" :class="{ 'rolling-animation': isRolling }">
        🎲 {{ dice[0] }}
      </span>
      <span class="dice" :class="{ 'rolling-animation': isRolling }">
        🎲 {{ dice[1] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.center-area { grid-column: 2 / 11; grid-row: 2 / 11; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 10px; margin: 4px; }
.center-area h1 { color: #0f4c5c; font-size: 2rem; margin-bottom: 15px; letter-spacing: 2px; }
.dice-container { display: flex; gap: 10px; }
.dice { font-size: 2rem; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; transition: all 0.2s; }

/* --- ANIMASI DADU BERPUTAR --- */
.rolling-animation {
  animation: shake 0.1s infinite;
  color: #666;
  transform: scale(1.1);
}

@keyframes shake {
  0% { transform: rotate(0deg) scale(1.1); }
  25% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(0deg) scale(1.1); }
  75% { transform: rotate(-10deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1.1); }
}
</style>