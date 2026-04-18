<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'

import AppPreloader from './components/AppPreloader.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.initAuth()
})
</script>

<template>
  <transition name="preloader-fade" mode="out-in">
    <AppPreloader v-if="!authStore.isAuthReady" />
    <div v-else class="min-h-screen">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.preloader-fade-enter-active,
.preloader-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.preloader-fade-enter-from,
.preloader-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(10px);
}
</style>
