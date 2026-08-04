<template>
  <div class="o3-skeleton" :class="rounded ? 'rounded' : ''" :style="{ width, height }" aria-hidden="true"></div>
</template>

<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  rounded: { type: Boolean, default: false },
})
</script>

<style scoped>
/* Balayage plutôt que pulsation : l'animation suggère un contenu qui arrive,
   là où un simple clignotement ressemble à une erreur. */
.o3-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface, #f2f2f2) 25%,
    rgba(0, 0, 0, 0.06) 37%,
    var(--color-surface, #f2f2f2) 63%
  );
  background-size: 400% 100%;
  animation: o3-shimmer 1.4s ease infinite;
}
.o3-skeleton.rounded {
  border-radius: 9999px;
}

@keyframes o3-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* Une animation en boucle est une gêne réelle pour les personnes sensibles au
   mouvement ; le bloc gris seul remplit la même fonction. */
@media (prefers-reduced-motion: reduce) {
  .o3-skeleton {
    animation: none;
    background: var(--color-surface, #f2f2f2);
  }
}
</style>
