<script setup lang="ts">
const props = defineProps<{
	healthy: boolean;
	text?: boolean;
}>();
</script>

<template>
  <div
    v-if="props.healthy"
    class="status-container"
  >
    <div class="status-circle healthy">
      <Icon name="ph:check-bold" />
    </div>
    <p
      v-if="props.text"
      class="status-text healthy"
    >
      Operational
    </p>
  </div>
  <div
    v-else
    class="status-container"
  >
    <div class="status-circle unhealthy">
      <Icon name="ph:x-bold" />
    </div>
    <p
      v-if="props.text"
      class="status-text unhealthy"
    >
      Outage
    </p>
  </div>
</template>

<style lang="css" scoped>
.status-container {
	display: flex;
	gap: 0.5em;
	align-items: center;
}

.status-circle {
	height: 1.5rem;
	width: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	border-radius: 4rem;
	font-size: 0.8em;
}

.status-circle.healthy {
	background-color: var(--operational-1);
}

.status-circle.unhealthy {
	background-color: var(--outage-1);
}

.status-text {
	font-size: 0.9em;
	font-weight: bold;
}

.status-text.healthy {
	color: var(--operational-1);
}

.status-text.unhealthy {
	color: var(--outage-1);
}
</style>
