<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';

const route = useRoute();
const { data, suspense } = useQuery({
	queryKey: ['status'],
	queryFn: () => $fetch(`/api/incidents/${route.params.id}`)
});
const title = computed(() => data.value?.posts?.[0]?.title);
const newestBody = computed(() => data.value ? data.value.posts?.[data.value.posts.length - 1]?.body ?? null : null);

useHead({
	title: () => `${title.value ?? 'Incident'} / Pretendo Network Status`
});
useSeoMeta({
	description: () => newestBody.value ?? undefined
});

onServerPrefetch(async () => {
	await suspense();
});
</script>

<template>
  <div>
    <Container>
      <div class="incident">
        <div
          v-if="!data"
          class="loading"
        >
          <Loader />
        </div>
        <Incident
          v-else
          :incident="data"
        />
      </div>
    </Container>
  </div>
</template>

<style lang="css" scoped>
.loading {
	display: flex;
	align-items: center;
	justify-content: center;
}
.incident {
	margin: 6rem 0;
}
</style>
