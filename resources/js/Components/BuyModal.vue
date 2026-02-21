<script setup>
defineProps({
  show: Boolean,
  property: Object,
  player: Object
});
defineEmits(['buy', 'skip']);
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Beli Properti?</h2>
      
      <div v-if="property" class="property-card" :style="{ borderTopColor: property.color || '#333' }">
        <h3>{{ property.name.replace('\n', ' ') }}</h3>
        <p class="price">Harga: Rp {{ property.price }}</p>
      </div>
      
      <p v-if="player">Uang <b>{{ player.name }}</b> saat ini:<br/>Rp {{ player.money }}</p>

      <div class="modal-actions">
        <button class="btn-buy" @click="$emit('buy')">Beli</button>
        <button class="btn-skip" @click="$emit('skip')">Lewati</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal-content { background: white; padding: 25px; border-radius: 12px; text-align: center; width: 300px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.property-card { border: 2px solid #ccc; border-top-width: 15px; border-radius: 8px; margin: 15px 0; padding: 15px; background: #f9f9f9; }
.property-card h3 { margin: 0 0 10px 0; font-size: 1.2rem;}
.price { font-size: 1.2rem; font-weight: bold; color: #2e8b57; margin: 0;}
.modal-actions { display: flex; gap: 10px; margin-top: 20px; }
button { flex: 1; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; transition: transform 0.1s; }
button:active { transform: scale(0.95); }
.btn-buy { background: #2e8b57; color: white; }
.btn-skip { background: #e63946; color: white; }
</style>