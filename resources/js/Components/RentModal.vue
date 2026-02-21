<script setup>
defineProps({
  show: Boolean,
  details: Object // Menyimpan info siapa yang bayar, ke siapa, dan berapa
});
defineEmits(['pay']); // Memberi tahu mesin untuk memproses pembayaran
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="icon-warning">💸</div>
      <h2>Aduh! Kena Denda</h2>
      
      <div v-if="details" class="rent-info">
        <p>
          <b>{{ details.payerName }}</b> berhenti di <b>{{ details.propertyName }}</b> 
          milik <b>{{ details.ownerName }}</b>.
        </p>
        <div class="rent-amount">
          Biaya Sewa:<br/>
          <span>Rp {{ details.amount }}</span>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-pay" @click="$emit('pay')">Bayar Sekarang</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: white; padding: 25px; border-radius: 12px; text-align: center; width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: popIn 0.3s ease-out; }
.icon-warning { font-size: 3rem; margin-bottom: 10px; }
h2 { color: #d90429; margin-top: 0; }
.rent-info p { font-size: 1rem; line-height: 1.5; color: #333; }
.rent-amount { background: #ffe3e0; color: #d90429; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; margin: 15px 0; border: 1px dashed #d90429; }
.rent-amount span { font-size: 1.5rem; }
.modal-actions { display: flex; margin-top: 20px; }
button { flex: 1; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; background: #d90429; color: white; font-size: 1.1rem; transition: transform 0.1s; }
button:active { transform: scale(0.95); }

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>