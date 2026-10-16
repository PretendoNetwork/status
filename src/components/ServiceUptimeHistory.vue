<script setup lang="ts">
import { useNow } from '@vueuse/core';
import { Tooltip } from 'reka-ui/namespaced';
import type { StatusServiceTimeline } from '~~/shared/types';

const props = defineProps<{
	isCurrentlyHealthy?: boolean;
	timeline: StatusServiceTimeline;
}>();

const now = useNow();
const today = computed(() => {
	const day = new Date(now.value);
	day.setUTCHours(0, 0, 0, 0);
	return day.toISOString();
});
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
	let data = props.timeline[day] ?? [0, 0];

	// If today, add the current check results to it so it doesnt have the chance to appear gray
	if (day === today.value) {
		const copy: [number, number] = [...data];
		copy[0] += 1;
		copy[1] += props.isCurrentlyHealthy ? 1 : 0;
		data = copy;
	}

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
    <template
      v-for="dayInfo of dayInfos"
      :key="dayInfo.day"
    >
      <Tooltip.Root
        :delay-duration="0"
        disable-closing-trigger
        disable-hoverable-content
      >
        <Tooltip.Trigger as-child>
          <div
            class="grid-item"
            :class="{
              blank: dayInfo.isBlank,
              degraded: dayInfo.isDegraded,
              outage: dayInfo.isOutage,
            }"
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            class="global--grid-item-tooltip"
            :side-offset="5"
            side="bottom"
          >
            <ClientOnly>{{ new Date(dayInfo.day).toLocaleDateString() }}</ClientOnly>  -  {{ dayInfo.uptime.toFixed(2) }}%
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </template>
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
	background: var(--operational-1);
	transition:
		opacity 50ms ease-in-out,
		transform 100ms ease-in-out;
}
.grid-item.blank {
	pointer-events: none;
	background: var(--bg-shade-4);
}
.grid-item.degraded {
	background:
		repeating-linear-gradient(
			45deg,
			var(--degraded-1),
			var(--degraded-1) 4px,
			var(--degraded-2) 4px,
			var(--degraded-2) 8px
		),
		var(--degraded-2);
}
.grid-item.outage {
	background: var(--outage-1);
}

.grid-item:hover {
	opacity: 1;
	transform: scale(1.25);
}
</style>

<style lang="css">
.global--grid-item-tooltip {
	background-color: var(--bg-shade-0);
	border: 1px solid var(--bg-shade-4);
	color: var(--text-shade-2);
	border-radius: 10px;
	font-size: 0.8rem;
	padding: 0.4rem 0.8rem;

	animation-duration: 250ms;
  will-change: transform, opacity;
	animation-name: tooltipAnim;
}

@keyframes tooltipAnim {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
