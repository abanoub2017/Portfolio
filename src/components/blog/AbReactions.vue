<script setup lang="ts">
/**
 * AbReactions.vue
 *
 * DEV.to-style reactions.
 * - Desktop (lg+): vertical sticky sidebar shown via `variant="sidebar"` (passed from parent layout)
 * - Mobile (<lg):  fixed bottom bar via `variant="bar"`
 *
 * Counts use Firestore atomic increments. Visitor state is stored in localStorage.
 */
import { ref, computed, onMounted } from 'vue'
import type { BlogPostMeta, ReactionKey } from '@/types/blog'

const props = defineProps<{
    post: BlogPostMeta
    variant: 'sidebar' | 'bar'
    onReact: (key: ReactionKey, direction: 1 | -1) => void
}>()

const REACTIONS: { key: ReactionKey; emoji: string; label: string }[] = [
    { key: 'heart', emoji: '❤️', label: 'Love it' },
    { key: 'fire', emoji: '🔥', label: 'Hot take' },
    { key: 'mind_blown', emoji: '🤯', label: 'Mind blown' },
]

const storageKey = computed(() => `reactions_${props.post.slug}`)
const myReactions = ref<ReactionKey[]>([])
const localDelta = ref<Record<ReactionKey, number>>({ heart: 0, fire: 0, mind_blown: 0 })

onMounted(() => {
    try {
        const stored = localStorage.getItem(storageKey.value)
        if (stored) myReactions.value = JSON.parse(stored) as ReactionKey[]
    } catch { myReactions.value = [] }
})

function count(key: ReactionKey) {
    return Math.max(0, (props.post.reactions?.[key] ?? 0) + localDelta.value[key])
}
function hasReacted(key: ReactionKey) {
    return myReactions.value.includes(key)
}
function toggle(key: ReactionKey) {
    const already = hasReacted(key)
    const direction: 1 | -1 = already ? -1 : 1
    localDelta.value[key] += direction
    myReactions.value = already
        ? myReactions.value.filter(r => r !== key)
        : [...myReactions.value, key]
    try { localStorage.setItem(storageKey.value, JSON.stringify(myReactions.value)) } catch { }
    props.onReact(key, direction)
}
</script>

<template>
    <!-- ── Desktop sidebar (vertical) ──────────────────────────────────────── -->
    <div v-if="variant === 'sidebar'" class="flex flex-col items-center gap-5">
        <button v-for="r in REACTIONS" :key="r.key" type="button" :title="r.label"
            :aria-label="`${r.label} — ${count(r.key)}`" :aria-pressed="hasReacted(r.key)" @click="toggle(r.key)"
            class="group flex flex-col items-center gap-1.5 select-none">
            <!-- Circle icon -->
            <span class="w-12 h-12 flex items-center justify-center rounded-full text-2xl transition-all duration-200"
                :class="hasReacted(r.key)
                    ? 'bg-indigo-500/15 ring-2 ring-indigo-500 scale-110'
                    : 'bg-gray-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:scale-110'"
                aria-hidden="true">{{ r.emoji }}</span>
            <!-- Count below -->
            <span class="text-xs font-semibold tabular-nums transition-colors duration-150"
                :class="hasReacted(r.key) ? 'text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'">
                {{ count(r.key) }}
            </span>
        </button>
    </div>

    <!-- ── Mobile bottom bar (horizontal) ──────────────────────────────────── -->
    <div v-else class="flex items-center justify-around w-full">
        <button v-for="r in REACTIONS" :key="r.key" type="button" :title="r.label"
            :aria-label="`${r.label} — ${count(r.key)}`" :aria-pressed="hasReacted(r.key)" @click="toggle(r.key)"
            class="group flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-150 select-none" :class="hasReacted(r.key)
                ? 'text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'">
            <span class="text-xl leading-none transition-transform duration-150"
                :class="hasReacted(r.key) ? 'scale-125' : 'group-hover:scale-110'" aria-hidden="true">{{ r.emoji
                }}</span>
            <span class="text-sm font-semibold tabular-nums">{{ count(r.key) }}</span>
        </button>
    </div>
</template>
