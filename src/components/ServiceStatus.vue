<script setup lang="ts">
const props = defineProps<{
	healthy: boolean;
	text?: boolean;
}>();
</script>

<template>
  <div v-if="props.healthy">
    <div class="status-circle healthy">
      <Icon name="ph:check-bold" />
    </div>
    <p
      v-if="props.text"
      class="status-text"
    >
      Operational
    </p>
  </div>
  <div v-else>
    <div class="status-circle unhealthy">
      <Icon name="ph:x-bold" />
    </div>
    <p
      v-if="props.text"
      class="status-text"
    >
      Outage
    </p>
  </div>
</template>

<style lang="css" scoped>
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
	background-color: #6ea73a;
}

.status-circle.unhealthy {
	background-color: #c53737;
}
</style>
