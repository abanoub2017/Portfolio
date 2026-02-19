<script setup lang="ts">
import { computed } from 'vue'
import AbInlineContent from '@/components/blog/AbInlineContent'
import type { ProseMirrorNode } from '@/types/blog'

const props = defineProps<{ node: ProseMirrorNode }>()

/**
 * TipTap blockquote wraps paragraph children.
 * Flatten their inline nodes into one stream.
 */
const inlineContent = computed<ProseMirrorNode[]>(() =>
    (props.node.content ?? [])
        .filter((n) => n.type === 'paragraph')
        .flatMap((p) => p.content ?? []),
)
</script>

<template>
    <blockquote class="border-l-4 border-indigo-500 pl-4 italic text-gray-500 dark:text-gray-400 my-6">
        <AbInlineContent :content="inlineContent" />
    </blockquote>
</template>
