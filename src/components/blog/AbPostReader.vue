<script setup lang="ts">
/**
 * AbPostReader.vue
 *
 * Renders a ProseMirror document JSON tree as a Vue component tree.
 * Each node type is dispatched to its matching AbBlock* component.
 * Unknown types gracefully fall back to AbBlockParagraph.
 *
 * NO v-html — every node becomes real VNodes through the block components.
 */
import { computed, type Component } from 'vue'
import type { ProseMirrorNode } from '@/types/blog'

import AbBlockParagraph from './blocks/AbBlockParagraph.vue'
import AbBlockHeading from './blocks/AbBlockHeading.vue'
import AbBlockBulletList from './blocks/AbBlockBulletList.vue'
import AbBlockOrderedList from './blocks/AbBlockOrderedList.vue'
import AbBlockBlockquote from './blocks/AbBlockBlockquote.vue'
import AbBlockCode from './blocks/AbBlockCode.vue'
import AbBlockImage from './blocks/AbBlockImage.vue'
import AbBlockHardBreak from './blocks/AbBlockHardBreak.vue'
import AbBlockHorizontalRule from './blocks/AbBlockHorizontalRule.vue'

const props = defineProps<{
    /** Raw ProseMirror doc object from Firestore (TipTap JSON output) */
    doc: Record<string, unknown> | null | undefined
}>()

/** Map from ProseMirror node type → block component. */
const blockMap: Record<string, Component> = {
    paragraph: AbBlockParagraph,
    heading: AbBlockHeading,
    bulletList: AbBlockBulletList,
    ordered_list: AbBlockOrderedList,
    orderedList: AbBlockOrderedList,
    blockquote: AbBlockBlockquote,
    codeBlock: AbBlockCode,
    code_block: AbBlockCode,
    image: AbBlockImage,
    hardBreak: AbBlockHardBreak,
    horizontalRule: AbBlockHorizontalRule,
    horizontal_rule: AbBlockHorizontalRule,
}

const nodes = computed<ProseMirrorNode[]>(() => {
    if (!props.doc) return []
    const doc = props.doc as ProseMirrorNode
    return doc.content ?? []
})

function componentFor(type: string): Component {
    return blockMap[type] ?? AbBlockParagraph
}
</script>

<template>
    <article class="post-reader">
        <component :is="componentFor(node.type)" v-for="(node, i) in nodes" :key="i" :node="node" />
    </article>
</template>
