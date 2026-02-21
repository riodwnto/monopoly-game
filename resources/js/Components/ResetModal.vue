<script setup>
defineProps({ show: Boolean });
defineEmits(['close', 'confirm']);
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="reset-card">
        <div class="reset-icon">🔄</div>
        <div class="reset-content">
          <h2 class="reset-title">Reset Permainan?</h2>
          <p class="reset-message">Seluruh progres permainan saat ini akan dihapus dan dimulai kembali dari awal.</p>
        </div>

        <div class="reset-actions">
          <button class="btn-cancel" @click="$emit('close')">BATAL</button>
          <button class="btn-confirm-reset" @click="$emit('confirm')">YA, RESET</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 61, 74, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 7000;
}

.reset-card {
  background: #ffffff;
  width: 90%;
  max-width: 350px;
  padding: 30px;
  border-radius: 4px;
  text-align: center;
  border: 4px solid #e63946; /* Merah sesuai tombol reset */
}

.reset-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
}

.reset-title {
  color: #1a1a1a;
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.reset-message {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 25px;
}

.reset-actions {
  display: flex;
  gap: 10px;
}

.reset-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: #eee;
  color: #333;
}

.btn-confirm-reset {
  background: #e63946;
  color: white;
}

.btn-confirm-reset:hover { opacity: 0.9; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>