<script setup lang="ts">
import AbInlineContent from '@/components/blog/AbInlineContent'
import type { ProseMirrorNode } from '@/types/blog'

defineProps<{ node: ProseMirrorNode }>()
</script>

<template>
    <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        <AbInlineContent :content="node.content ?? []" />
    </p>
</template>
