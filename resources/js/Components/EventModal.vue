<script setup>
defineProps({ show: Boolean, details: Object });
defineEmits(['close']);
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="event-card">
        <div class="event-icon">{{ details?.icon }}</div>
        
        <div class="event-content">
          <h2 class="event-title">{{ details?.title }}</h2>
          <p class="event-message">{{ details?.message }}</p>
        </div>

        <button class="btn-confirm" @click="$emit('close')">MENGERTI</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Overlay Gelap dengan Blur Tipis */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 61, 74, 0.8); /* Warna senada dengan background body */
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6000;
}

/* Kartu Event Flat */
.event-card {
  background: #ffffff;
  width: 90%;
  max-width: 320px;
  padding: 30px;
  border-radius: 4px; /* Sudut tegas untuk kesan minimalis */
  text-align: center;
  border: 4px solid #ffb703; /* Border tebal khas monopoli tapi flat */
  box-shadow: none;
}

.event-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  line-height: 1;
}

.event-content {
  margin-bottom: 25px;
}

.event-title {
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.event-message {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* Tombol Konfirmasi Flat */
.btn-confirm {
  width: 100%;
  padding: 12px;
  background: #0b3d4a;
  color: white;
  border: none;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.btn-confirm:hover {
  opacity: 0.9;
}

/* Animasi Masuk */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>