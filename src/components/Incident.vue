<script setup lang="ts">
import type { Incident } from '~~/shared/types';

const props = defineProps<{
	incident: Incident;
}>();
</script>

<template>
  <div
    class="incident"
    :class="{
      ongoing: !props.incident.resolvedAt,
    }"
  >
    <p
      class="incident-tag"
      :class="{
        ongoing: !props.incident.resolvedAt,
      }"
    >
      Incident
    </p>
    <div class="incident-timeline" />
    <article
      v-for="post of props.incident.posts"
      :key="post.id"
      class="incident-post"
    >
      <div class="post-dot" />
      <p class="post-date">
        {{ new Date(post.createdAt).toLocaleString() }}
      </p>
      <h1 class="post-title">
        {{ post.title }}
      </h1>
      <p
        v-if="post.body"
        class="post-content"
      >
        {{ post.body }}
      </p>
    </article>
  </div>
</template>

<style lang="css" scoped>
.incident {
	background-color: var(--bg-shade-0);
	border: 1px solid var(--bg-shade-3);
	padding: 2rem;
	border-radius: 15px;
	position: relative;
}

.incident-tag {
	position: absolute;
	font-size: 0.8rem;
	top: -0.8rem;
	left: 2rem;
	background-color: var(--bg-shade-2);
	border: 1px solid var(--bg-shade-5);
	padding: 0.1rem 0.8rem;
	border-radius: 10000px;
	color: var(--text-shade-2);
}

.incident.ongoing {
	border-color: var(--degraded-1);
}
.incident-tag.ongoing {
	color: var(--text-shade-1);
}

.incident-timeline {
	position: absolute;
	top: 2.5rem;
	bottom: 0;
	left: calc(1.5rem + 2px);
	background-color: var(--bg-shade-2);
	width: 1px;
}

.incident-post {
	padding-left: 1rem;
	position: relative;
	margin-bottom: 2rem;
}
.incident .incident-post:last-of-type {
	margin-bottom: 0px;
}

.post-dot {
	height: 5px;
	width: 5px;
	position: absolute;
	left: -0.5rem;
	top: 0.5rem;
	background-color: var(--text-shade-3);
	border-radius: 100px;
}
.post-title {
	font-size: 1.1rem;
	color: var(--text-shade-1);
	margin-bottom: 0.5rem;
}
.post-date {
	position: absolute;
	right: 0;
	top: 0.1rem;
	font-size: 0.6rem;
	color: var(--text-shade-3);
}
.post-content {
	font-size: 0.9rem;
}
</style>
