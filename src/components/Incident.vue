<script setup lang="ts">
import type { Incident } from '~~/shared/types';

const props = defineProps<{
	incident: Incident;
}>();
</script>

<template>
  <div class="incident">
    <p>Status: {{ props.incident.resolvedAt ? 'Resolved' : 'Ongoing' }}</p>
    <div
      v-for="post of props.incident.posts"
      :key="post.id"
      class="incident-post"
    >
      <h1>{{ post.title }}</h1>
      <p v-if="post.body">
        {{ post.body }}
      </p>
    </div>
  </div>
</template>
