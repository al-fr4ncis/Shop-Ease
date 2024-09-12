<script setup>
import NavView from '@/views/NavView.vue'
import FooterView from '@/components/FooterView.vue'
import PaginationMenu from '@/components/PaginationMenu.vue'
</script>

<template>
  <div class="layout-container">
    <NavView />
    <div class="main-content">
      <RouterView />
    </div>
    <PaginationMenu />
    <FooterView v-if="$route.name != 'cart'" />
  </div>
</template>

<style>
.layout-container {
  display: flex;
  flex-direction: column;
}

.main-content {
  min-height: 100dvh;
}

@font-face {
  font-family: MarketFresh;
  src: url(/src/assets/Fonts/market_fresh/Market\ Fresh.ttf);
}
</style>
