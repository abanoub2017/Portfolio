<script setup lang="ts">
import { computed } from 'vue'
import AbInlineContent from '@/components/blog/AbInlineContent'
import type { ProseMirrorNode } from '@/types/blog'

const props = defineProps<{ node: ProseMirrorNode }>()

const level = computed(() => (props.node.attrs?.['level'] as number) ?? 2)

const cls = computed(() =>
    level.value === 2
        ? 'text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4'
        : 'text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3',
)
</script>

<template>
    <h2 v-if="level === 2" :class="cls">
        <AbInlineContent :content="node.content ?? []" />
    </h2>
    <h3 v-else :class="cls">
        <AbInlineContent :content="node.content ?? []" />
    </h3>
</template>
