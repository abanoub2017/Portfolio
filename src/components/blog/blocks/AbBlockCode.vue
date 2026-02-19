<script setup lang="ts">
import { computed, ref } from 'vue'
import { createLowlight, common } from 'lowlight'
import type { ProseMirrorNode } from '@/types/blog'

const props = defineProps<{ node: ProseMirrorNode }>()

const lowlight = createLowlight(common)

// ─── Raw text ─────────────────────────────────────────────────────────────────
const code = computed<string>(() =>
    (props.node.content ?? [])
        .filter((n) => n.type === 'text')
        .map((n) => n.text ?? '')
        .join(''),
)

const language = computed<string | null>(
    () => (props.node.attrs?.['language'] as string | null) ?? null,
)

// ─── hast → HTML string ───────────────────────────────────────────────────────
type HastNode =
    | { type: 'root'; children: HastNode[] }
    | { type: 'element'; tagName: string; properties: Record<string, unknown>; children: HastNode[] }
    | { type: 'text'; value: string }

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function hastToHtml(nodes: HastNode[]): string {
    return nodes.map((node) => {
        if (node.type === 'text') return escapeHtml(node.value)
        if (node.type === 'element') {
            const cls = Array.isArray(node.properties?.className)
                ? (node.properties.className as string[]).join(' ')
                : ''
            const attrs = cls ? ` class="${cls}"` : ''
            const inner = hastToHtml(node.children ?? [])
            return `<${node.tagName}${attrs}>${inner}</${node.tagName}>`
        }
        return ''
    }).join('')
}

const highlightedHtml = computed<string>(() => {
    if (!code.value) return ''
    try {
        const lang = language.value ?? 'plaintext'
        const supported = lowlight.listLanguages().includes(lang)
        const result = supported
            ? lowlight.highlight(lang, code.value)
            : lowlight.highlightAuto(code.value)
        return hastToHtml((result as unknown as { children: HastNode[] }).children)
    } catch {
        return escapeHtml(code.value)
    }
})

// ─── Copy to clipboard ────────────────────────────────────────────────────────
const copied = ref(false)
async function copyCode() {
    await navigator.clipboard.writeText(code.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
    <div class="my-6 rounded-xl overflow-hidden border border-slate-700 bg-[#0d1117]">
        <!-- Header bar: language label + copy button -->
        <div class="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-700">
            <span class="text-[11px] font-semibold tracking-widest uppercase text-slate-400 select-none">
                {{ language ?? 'code' }}
            </span>
            <button @click="copyCode"
                class="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors"
                :aria-label="copied ? 'Copied!' : 'Copy code'">
                <!-- Checkmark when copied -->
                <svg v-if="copied" class="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor"
                    stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <!-- Copy icon -->
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                {{ copied ? 'Copied!' : 'Copy' }}
            </button>
        </div>

        <!-- Code body -->
        <pre
            class="overflow-x-auto p-5 text-sm font-mono leading-relaxed m-0 bg-[#0d1117] text-[#cdd9e5]"><code class="hljs" v-html="highlightedHtml" /></pre>
    </div>
</template>

<style>
/* ── GitHub Dark syntax theme ─────────────────────────────────────────────── */
:deep(.hljs-comment),
:deep(.hljs-quote) {
    color: #8b949e;
    font-style: italic;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-literal) {
    color: #ff7b72;
}

:deep(.hljs-string),
:deep(.hljs-attr),
:deep(.hljs-addition) {
    color: #a5d6ff;
}

:deep(.hljs-variable),
:deep(.hljs-template-variable),
:deep(.hljs-selector-attr) {
    color: #ffa657;
}

:deep(.hljs-number),
:deep(.hljs-meta) {
    color: #79c0ff;
}

:deep(.hljs-type),
:deep(.hljs-class .hljs-title),
:deep(.hljs-title) {
    color: #f0883e;
}

:deep(.hljs-function),
:deep(.hljs-title.hljs-function__) {
    color: #d2a8ff;
}

:deep(.hljs-built_in),
:deep(.hljs-builtin-name) {
    color: #ffa657;
}

:deep(.hljs-params) {
    color: #cdd9e5;
}

:deep(.hljs-deletion) {
    color: #ffa198;
    background: #67060c;
}

:deep(.hljs-symbol),
:deep(.hljs-bullet),
:deep(.hljs-link) {
    color: #a5d6ff;
}

:deep(.hljs-regexp) {
    color: #7ee787;
}

:deep(.hljs-tag),
:deep(.hljs-selector-id),
:deep(.hljs-selector-class) {
    color: #7ee787;
}

:deep(.hljs-attribute) {
    color: #79c0ff;
}

:deep(.hljs-operator),
:deep(.hljs-punctuation) {
    color: #cdd9e5;
}
</style>
