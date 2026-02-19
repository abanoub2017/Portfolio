<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import { useBlogStore } from '@/stores/blog'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import { useImageUpload } from '@/composables/admin/useImageUpload'
import AdminImageUpload from '@/components/admin/AdminImageUpload.vue'
import type { BlogPostDraft } from '@/types/blog'

// ─── Setup ────────────────────────────────────────────────────────────────────

const lowlight = createLowlight(common)

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const toast = useAdminToast()
const { compress } = useImageUpload()

const isEdit = computed(() => !!route.params.id)
const postId = computed(() => route.params.id as string | undefined)

// ─── TipTap editor ────────────────────────────────────────────────────────────

const editor = useEditor({
    extensions: [
        StarterKit.configure({ codeBlock: false }),
        CodeBlockLowlight.configure({ lowlight }),
        ImageExtension,
        Link.configure({ openOnClick: false }),
    ],
    editorProps: {
        attributes: { class: 'tiptap-editor focus:outline-none' },
    },
    content: '',
})

onBeforeUnmount(() => editor.value?.destroy())

// ─── Form state ───────────────────────────────────────────────────────────────

const defaultDraft = (): BlogPostDraft => ({
    title: '',
    slug: '',
    excerpt: '',
    coverImageBase64: '',
    category: '',
    tags: [],
    isPublished: false,
    featured: false,
    publishDate: new Date(),
    readingTime: 1,
    metaTitle: '',
    metaDescription: '',
})

const form = ref<BlogPostDraft>(defaultDraft())
const slugManuallyEdited = ref(false)
const tagsInput = ref('')

// Auto-generate slug from title unless manually edited
watch(
    () => form.value.title,
    (title) => {
        if (!slugManuallyEdited.value) {
            form.value.slug = toSlug(title)
        }
    },
)

// Keep tags array in sync with the text input
watch(tagsInput, (v) => {
    form.value.tags = v
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
})

// Publish date ↔ HTML date input string
const publishDateStr = computed({
    get: () => {
        const d = form.value.publishDate
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },
    set: (v: string) => {
        // Add T12:00:00 to avoid UTC offset shifting the date to the previous day
        form.value.publishDate = new Date(`${v}T12:00:00`)
    },
})

// ─── Character counters ───────────────────────────────────────────────────────

const excerptLength = computed(() => form.value.excerpt.length)
const excerptColor = computed(() =>
    excerptLength.value === 0
        ? 'text-gray-600'
        : excerptLength.value <= 200
            ? 'text-green-400'
            : 'text-red-400',
)

const metaDescLength = computed(() => form.value.metaDescription.length)
const metaDescColor = computed(() =>
    metaDescLength.value === 0
        ? 'text-gray-600'
        : metaDescLength.value <= 160
            ? 'text-green-400'
            : 'text-red-400',
)

// ─── Saving state ─────────────────────────────────────────────────────────────

const saving = ref(false)
const saved = ref(false)

// ─── Load existing post (edit mode) ──────────────────────────────────────────

onMounted(async () => {
    if (!isEdit.value || !postId.value) return
    await blogStore.loadPostById(postId.value)
    const meta = blogStore.currentMeta
    const content = blogStore.currentContent
    if (!meta) {
        toast.error('Post not found.')
        router.push({ name: 'admin-blog' })
        return
    }
    form.value = {
        title: meta.title,
        slug: meta.slug,
        excerpt: meta.excerpt,
        coverImageBase64: meta.coverImageBase64,
        category: meta.category,
        tags: meta.tags,
        isPublished: meta.isPublished,
        featured: meta.featured,
        publishDate: meta.publishDate,
        readingTime: meta.readingTime,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
    }
    tagsInput.value = meta.tags.join(', ')
    slugManuallyEdited.value = true // slug was set by user originally
    if (content?.body) {
        editor.value?.commands.setContent(content.body)
    }
})

// ─── Toolbar actions ──────────────────────────────────────────────────────────

function applyHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    editor.value?.chain().focus().toggleHeading({ level }).run()
}

function setLink() {
    const prev = editor.value?.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', prev ?? 'https://')
    if (url === null) return // cancelled
    if (url === '') {
        editor.value?.chain().focus().unsetLink().run()
        return
    }
    editor.value?.chain().focus().setLink({ href: url, target: '_blank' }).run()
}

// Hidden file input for in-body images
const imageInputRef = ref<HTMLInputElement | null>(null)

function triggerImageUpload() {
    imageInputRef.value?.click()
}

async function onBodyImageSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
        const base64 = await compress(file)
        editor.value?.chain().focus().setImage({ src: base64 }).run()
    } catch {
        toast.error('Image compression failed. Try a smaller image.')
    } finally {
        // Reset so the same file can be re-selected
        if (imageInputRef.value) imageInputRef.value.value = ''
    }
}

// ─── Save ─────────────────────────────────────────────────────────────────────

function calcReadingTime(): number {
    const text = editor.value?.getText() ?? ''
    const words = text.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
}

async function handleSave() {
    if (!form.value.title.trim()) {
        toast.error('Title is required before saving.')
        return
    }
    saving.value = true
    const body = editor.value?.getJSON() ?? {}
    const draft: BlogPostDraft = { ...form.value, readingTime: calcReadingTime() }
    try {
        if (isEdit.value && postId.value) {
            await blogStore.save(postId.value, draft, body)
            toast.success('Post saved.')
        } else {
            const newId = await blogStore.create(draft, body)
            if (newId) {
                toast.success('Post created.')
                // Redirect to edit URL so subsequent saves are updates
                await router.replace({ name: 'admin-blog-edit', params: { id: newId } })
                slugManuallyEdited.value = true
            }
        }
        saved.value = true
        setTimeout(() => { saved.value = false }, 2500)
    } catch {
        toast.error('Failed to save post. Please try again.')
    } finally {
        saving.value = false
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

function isActive(name: string, attrs?: Record<string, unknown>) {
    return editor.value?.isActive(name, attrs) ?? false
}
</script>

<template>
    <div class="flex flex-col min-h-0">

        <!-- ─── Page header ───────────────────────────────────────────────────────── -->
        <div class="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-4">
                <button @click="router.push({ name: 'admin-blog' })"
                    class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <div class="h-4 w-px bg-gray-700" />
                <h1 class="text-xl font-bold text-white">
                    {{ isEdit ? 'Edit Post' : 'New Post' }}
                </h1>
            </div>

            <!-- Save button -->
            <button @click="handleSave" :disabled="saving"
                class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all" :class="saved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'">
                <!-- Spinner -->
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <!-- Checkmark -->
                <svg v-else-if="saved" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ saving ? 'Saving…' : saved ? 'Saved' : 'Save' }}
            </button>
        </div>

        <!-- ─── Two-column layout ─────────────────────────────────────────────────── -->
        <div class="flex flex-col lg:flex-row gap-6 min-h-0">

            <!-- ── Editor column ────────────────────────────────────────────────────── -->
            <div class="flex-1 flex flex-col min-w-0 gap-4">

                <!-- Title input (above editor, full-width feel) -->
                <input v-model="form.title" type="text" placeholder="Post title…"
                    class="w-full bg-transparent text-white text-2xl font-bold placeholder-gray-600 border-none outline-none focus:outline-none px-0 py-1" />

                <!-- Rich text editor -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden">

                    <!-- Toolbar -->
                    <div class="flex items-center gap-0.5 px-3 py-2 border-b border-gray-800 flex-wrap overflow-x-auto">

                        <!-- Text style group -->
                        <button type="button" @click="editor?.chain().focus().toggleBold().run()"
                            :class="isActive('bold') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Bold">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                            </svg>
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleItalic().run()"
                            :class="isActive('italic') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Italic">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
                            </svg>
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleStrike().run()"
                            :class="isActive('strike') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Strikethrough">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.65 1.46 1.73 1.46 3.24h-3.01c0-.31-.05-.59-.15-.85-.29-.86-1.2-1.28-2.25-1.28-1.86 0-2.34.9-2.34 1.6 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.17-.36-.54-.85-.54-1.82zM21 12v-2H3v2h9.62c1.15.45 1.96.75 1.96 1.97 0 1-.81 1.67-2.28 1.67-1.54 0-2.93-.51-2.93-2.29H6.37c0 .7.14 1.34.43 1.9.45.86 1.2 1.52 2.1 1.96C9.83 17.83 11 18 12.16 18c1.37 0 2.6-.27 3.56-.82.97-.55 1.77-1.51 1.77-3.04 0-.69-.19-1.29-.5-1.85L21 12z" />
                            </svg>
                        </button>

                        <div class="w-px h-5 bg-gray-700 mx-1" />

                        <!-- Heading group -->
                        <button type="button" @click="applyHeading(2)"
                            :class="isActive('heading', { level: 2 }) ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="px-2 py-1.5 rounded-lg text-xs font-bold transition-colors" title="Heading 2">
                            H2
                        </button>
                        <button type="button" @click="applyHeading(3)"
                            :class="isActive('heading', { level: 3 }) ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="px-2 py-1.5 rounded-lg text-xs font-bold transition-colors" title="Heading 3">
                            H3
                        </button>

                        <div class="w-px h-5 bg-gray-700 mx-1" />

                        <!-- List group -->
                        <button type="button" @click="editor?.chain().focus().toggleBulletList().run()"
                            :class="isActive('bulletList') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Bullet list">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                            </svg>
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleOrderedList().run()"
                            :class="isActive('orderedList') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Ordered list">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2 6h.5M2 10h.5M2 14h.5M2 18h.5" />
                            </svg>
                        </button>

                        <div class="w-px h-5 bg-gray-700 mx-1" />

                        <!-- Block group -->
                        <button type="button" @click="editor?.chain().focus().toggleBlockquote().run()"
                            :class="isActive('blockquote') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Blockquote">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                            </svg>
                        </button>
                        <button type="button" @click="editor?.chain().focus().toggleCodeBlock().run()"
                            :class="isActive('codeBlock') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Code block">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </button>

                        <div class="w-px h-5 bg-gray-700 mx-1" />

                        <!-- Link / Image -->
                        <button type="button" @click="setLink"
                            :class="isActive('link') ? 'bg-gray-700 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
                            class="p-1.5 rounded-lg transition-colors" title="Link">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </button>
                        <button type="button" @click="triggerImageUpload"
                            class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="Insert image">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button type="button" @click="editor?.chain().focus().setHorizontalRule().run()"
                            class="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            title="Horizontal rule">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16" />
                            </svg>
                        </button>

                        <div class="flex-1" />

                        <!-- Undo / Redo -->
                        <button type="button" @click="editor?.chain().focus().undo().run()"
                            :disabled="!editor?.can().undo()"
                            class="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
                            title="Undo">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </button>
                        <button type="button" @click="editor?.chain().focus().redo().run()"
                            :disabled="!editor?.can().redo()"
                            class="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
                            title="Redo">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                        </button>
                    </div>

                    <!-- Editor content area -->
                    <EditorContent :editor="editor" class="flex-1 p-5 min-h-[480px] overflow-y-auto" />
                </div>

                <!-- Hidden file input for in-body image insertion -->
                <input ref="imageInputRef" type="file" accept="image/*" class="hidden" @change="onBodyImageSelected" />
            </div>

            <!-- ── Metadata sidebar ─────────────────────────────────────────────────── -->
            <div class="w-full lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0">

                <!-- Publication Settings -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                    <h3 class="text-white font-semibold text-sm">Publication</h3>

                    <!-- Status toggle -->
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-300 text-sm font-medium">Status</p>
                            <p class="text-gray-500 text-xs mt-0.5">
                                {{ form.isPublished ? 'Visible on public blog' : 'Draft — not visible to visitors' }}
                            </p>
                        </div>
                        <button type="button" @click="form.isPublished = !form.isPublished"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                            :class="form.isPublished ? 'bg-indigo-600' : 'bg-gray-700'">
                            <span
                                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                                :class="form.isPublished ? 'translate-x-6' : 'translate-x-1'" />
                        </button>
                    </div>

                    <!-- Featured toggle -->
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-300 text-sm font-medium">Featured</p>
                            <p class="text-gray-500 text-xs mt-0.5">Show in featured slot on blog list</p>
                        </div>
                        <button type="button" @click="form.featured = !form.featured"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                            :class="form.featured ? 'bg-indigo-600' : 'bg-gray-700'">
                            <span
                                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                                :class="form.featured ? 'translate-x-6' : 'translate-x-1'" />
                        </button>
                    </div>

                    <!-- Publish date -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Publish Date</label>
                        <input :value="publishDateStr"
                            @input="publishDateStr = ($event.target as HTMLInputElement).value" type="date"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                </div>

                <!-- Post Details -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                    <h3 class="text-white font-semibold text-sm">Post Details</h3>

                    <!-- Slug -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Slug</label>
                        <input v-model="form.slug" type="text" placeholder="my-post-slug"
                            @input="slugManuallyEdited = true"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors font-mono" />
                        <p class="text-gray-600 text-xs">Auto-generated from title. Edit to customise.</p>
                    </div>

                    <!-- Excerpt -->
                    <div class="flex flex-col gap-1.5">
                        <div class="flex items-center justify-between">
                            <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Excerpt</label>
                            <span class="text-xs" :class="excerptColor">{{ excerptLength }}/200</span>
                        </div>
                        <textarea v-model="form.excerpt" rows="3" placeholder="1–2 sentence summary…"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                    </div>

                    <!-- Category -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Category</label>
                        <input v-model="form.category" type="text" placeholder="e.g. Vue, Career, Tooling"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>

                    <!-- Tags -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Tags</label>
                        <input v-model="tagsInput" type="text" placeholder="vue, typescript, firebase"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                        <div v-if="form.tags.length" class="flex flex-wrap gap-1.5 mt-1">
                            <span v-for="tag in form.tags" :key="tag"
                                class="px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 text-xs">
                                {{ tag }}
                            </span>
                        </div>
                        <p class="text-gray-600 text-xs">Comma-separated list.</p>
                    </div>
                </div>

                <!-- Cover Image -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
                    <h3 class="text-white font-semibold text-sm">Cover Image</h3>
                    <AdminImageUpload v-model="form.coverImageBase64" />
                </div>

                <!-- SEO Overrides -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
                    <div>
                        <h3 class="text-white font-semibold text-sm">SEO Overrides</h3>
                        <p class="text-gray-500 text-xs mt-0.5">Optional. Falls back to title and excerpt.</p>
                    </div>

                    <!-- Meta title -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Meta Title</label>
                        <input v-model="form.metaTitle" type="text" placeholder="Defaults to post title"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>

                    <!-- Meta description -->
                    <div class="flex flex-col gap-1.5">
                        <div class="flex items-center justify-between">
                            <label class="text-gray-400 text-xs font-medium uppercase tracking-wide">Meta
                                Description</label>
                            <span class="text-xs" :class="metaDescColor">{{ metaDescLength }}/160</span>
                        </div>
                        <textarea v-model="form.metaDescription" rows="2" placeholder="Defaults to excerpt"
                            class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* TipTap editor prose styles — scoped to this component only */
:deep(.tiptap-editor) {
    color: theme('colors.gray.200');
    line-height: 1.75;
    font-size: 0.9375rem;
}

:deep(.tiptap-editor p) {
    margin-bottom: 0.75rem;
}

:deep(.tiptap-editor h2) {
    color: theme('colors.white');
    font-size: 1.375rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}

:deep(.tiptap-editor h3) {
    color: theme('colors.white');
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
}

:deep(.tiptap-editor ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
}

:deep(.tiptap-editor ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
}

:deep(.tiptap-editor li) {
    margin-bottom: 0.25rem;
}

:deep(.tiptap-editor blockquote) {
    border-left: 3px solid theme('colors.indigo.500');
    padding-left: 1rem;
    color: theme('colors.gray.400');
    font-style: italic;
    margin: 1rem 0;
}

:deep(.tiptap-editor code) {
    background: theme('colors.gray.800');
    color: theme('colors.indigo.300');
    font-family: ui-monospace, monospace;
    font-size: 0.875em;
    padding: 0.15em 0.4em;
    border-radius: 0.25rem;
}

:deep(.tiptap-editor pre) {
    background: theme('colors.gray.950');
    border: 1px solid theme('colors.gray.800');
    border-radius: 0.75rem;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
}

:deep(.tiptap-editor pre code) {
    background: none;
    padding: 0;
    font-size: 0.875rem;
    color: theme('colors.gray.200');
}

:deep(.tiptap-editor hr) {
    border: none;
    border-top: 1px solid theme('colors.gray.700');
    margin: 1.5rem 0;
}

:deep(.tiptap-editor img) {
    max-width: 100%;
    border-radius: 0.75rem;
    margin: 0.75rem 0;
}

:deep(.tiptap-editor a) {
    color: theme('colors.indigo.400');
    text-decoration: underline;
    text-underline-offset: 3px;
}

:deep(.tiptap-editor .ProseMirror-focused) {
    outline: none;
}

/* Placeholder */
:deep(.tiptap-editor p.is-editor-empty:first-child::before) {
    content: 'Start writing your post…';
    color: theme('colors.gray.600');
    pointer-events: none;
    float: left;
    height: 0;
}
</style>
