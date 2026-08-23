<script setup lang="ts">
import type { StatusServiceTimeline } from '~~/shared/types';

const props = defineProps<{
	timeline: StatusServiceTimeline;
}>();

const now = computed(() => new Date()); // TODO refresh
const last30Days = computed(() => {
	const end = new Date(now.value);
	end.setUTCHours(0, 0, 0, 0);
	end.setUTCDate(end.getUTCDate() + 1);

	const start = new Date(end);
	start.setUTCDate(start.getUTCDate() - 30);

	const output: string[] = [];
	while (start < end) {
		output.push(start.toISOString());
		start.setUTCDate(start.getUTCDate() + 1);
	}
	return output;
});

function getDayInfo(day: string) {
	const data = props.timeline[day] ?? [0, 0];
	const uptime = data[0] === 0 ? 100 : Math.round(data[1] / data[0] * 100_00) / 100;
	return {
		day,
		isBlank: data[0] === 0,
		isOk: uptime === 100,
		isDegraded: uptime >= 90 && uptime < 100,
		isOutage: uptime < 90,
		uptime
	};
}

const dayInfos = computed(() => {
	return last30Days.value.map(v => getDayInfo(v));
});
</script>

<template>
  <div class="grid">
    <div
      v-for="dayInfo of dayInfos"
      :key="dayInfo.day"
      class="grid-item"
      :class="{
        blank: dayInfo.isBlank,
        degraded: dayInfo.isDegraded,
        outage: dayInfo.isOutage,
      }"
    />
  </div>
</template>

<style lang="css" scoped>
.grid {
	display: flex;
	height: 1.5rem;
}
.grid-item {
	margin: 0 3px;
	border-radius: 50px;
	opacity: .7;
	flex: 1;
	background-color: var(--operational-1);
	transition:
		opacity 50ms ease-in-out,
		transform 100ms ease-in-out;
}
.grid-item.blank {
	pointer-events: none;
	background-color: var(--bg-shade-4);
}
.grid-item.degraded {
	background-color: var(--degraded-1);
}
.grid-item.outage {
	background-color: var(--outage-1);
}

.grid-item:hover {
	opacity: 1;
	transform: scale(1.25);
}
</style>
