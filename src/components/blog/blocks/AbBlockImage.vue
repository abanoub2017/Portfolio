<script setup lang="ts">
import { computed } from 'vue'
import type { ProseMirrorNode } from '@/types/blog'

const props = defineProps<{ node: ProseMirrorNode }>()

const src = computed<string>(() => (props.node.attrs?.['src'] as string) ?? '')
const alt = computed<string>(() => (props.node.attrs?.['alt'] as string) ?? '')
const title = computed<string | null>(
    () => (props.node.attrs?.['title'] as string | null) ?? null,
)
</script>

<template>
    <figure class="my-8">
        <img v-if="src" :src="src" :alt="alt" :title="title ?? undefined" class="w-full rounded-xl object-cover"
            loading="lazy" />
        <figcaption v-if="alt" class="mt-2 text-center text-sm text-gray-400 dark:text-gray-500">
            {{ alt }}
        </figcaption>
    </figure>
</template>
