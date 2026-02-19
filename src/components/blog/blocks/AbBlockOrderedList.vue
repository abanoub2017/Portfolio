<script setup lang="ts">
import AbBlockListItem from './AbBlockListItem.vue'
import type { ProseMirrorNode } from '@/types/blog'

defineProps<{ node: ProseMirrorNode }>()
</script>

<template>
    <ol class="list-decimal list-outside pl-6 mb-4 space-y-1 text-gray-600 dark:text-gray-300">
        <AbBlockListItem v-for="(item, i) in node.content ?? []" :key="i" :node="item" />
    </ol>
</template>
