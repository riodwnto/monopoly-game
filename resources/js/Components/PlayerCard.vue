<script setup>
// Menerima data dari file induk (Welcome.vue)
defineProps({
  player: Object,
  isActive: Boolean
});
</script>

<template>
  <div class="player-card" :class="[player.colorClass, { 'active-turn': isActive }]">
    {{ player.name }}: Rp {{ player.money }}
  </div>
</template>

<style scoped>
.player-card { padding: 12px 20px; border-radius: 8px; font-weight: bold; flex: 1; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: all 0.3s ease; opacity: 0.6; }
.player-card.red { background: #ff4d4d; color: white; border: 2px solid #ffb3b3; }
.player-card.blue { background: #4da6ff; color: white; border: 2px solid #b3d9ff; }
.active-turn { opacity: 1; transform: scale(1.05); box-shadow: 0 0 15px rgba(255, 255, 255, 0.8); border: 3px solid white !important; }
</style>