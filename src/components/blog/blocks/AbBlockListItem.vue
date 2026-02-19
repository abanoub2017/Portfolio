<script setup lang="ts">
import { computed } from 'vue'
import AbInlineContent from '@/components/blog/AbInlineContent'
import type { ProseMirrorNode } from '@/types/blog'

const props = defineProps<{ node: ProseMirrorNode }>()

/**
 * TipTap listItem wraps content in paragraph(s).
 * Flatten all paragraph inline nodes into a single stream.
 */
const inlineContent = computed<ProseMirrorNode[]>(() =>
    (props.node.content ?? [])
        .filter((n) => n.type === 'paragraph')
        .flatMap((p) => p.content ?? []),
)
</script>

<template>
    <li class="mb-1">
        <AbInlineContent :content="inlineContent" />
    </li>
</template>
