/**
 * src/components/blog/AbInlineContent.ts
 *
 * Render-function component that walks an array of ProseMirror inline nodes
 * and emits proper HTML elements for each mark type.
 *
 * Used by every AbBlock* component that contains inline text.
 * NEVER uses v-html — all output is VNode-based.
 *
 * Kept as a plain .ts file (not .vue) because it has no template block and
 * the Vue SFC parser chokes on TypeScript generics like PropType<ProseMirrorNode[]>.
 */
import { defineComponent, h, Fragment, type PropType, type VNode } from 'vue'
import type { ProseMirrorNode, ProseMirrorMark } from '@/types/blog'

/** Wrap a child VNode (or string) in the element corresponding to a mark. */
function applyMark(mark: ProseMirrorMark, child: VNode | string): VNode {
    switch (mark.type) {
        case 'bold':
            return h('strong', [child])
        case 'italic':
            return h('em', [child])
        case 'strike':
            return h('s', [child])
        case 'code':
            return h('code', { class: 'inline-code' }, [child])
        case 'link': {
            const attrs = mark.attrs ?? {}
            return h(
                'a',
                { href: attrs['href'] ?? '#', target: '_blank', rel: 'noopener noreferrer' },
                [child],
            )
        }
        default:
            return h('span', [child])
    }
}

/** Convert a single inline ProseMirror node to a VNode or string. */
function renderInlineNode(node: ProseMirrorNode): VNode | string {
    if (node.type === 'hardBreak') return h('br')
    if (node.type !== 'text' || !node.text) return ''

    const marks = node.marks ?? []
    let result: VNode | string = node.text
    for (let i = marks.length - 1; i >= 0; i--) {
        result = applyMark(marks[i]!, result)
    }
    return result
}

export default defineComponent({
    name: 'AbInlineContent',
    props: {
        content: {
            type: Array as PropType<ProseMirrorNode[]>,
            default: () => [],
        },
    },
    setup(props) {
        return () => h(Fragment, (props.content ?? []).map(renderInlineNode))
    },
})
