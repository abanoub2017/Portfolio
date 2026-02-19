<template>
    <div
        class="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col animate-pulse">
        <!-- Cover image skeleton -->
        <div class="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600" />

        <!-- Body skeleton -->
        <div class="flex flex-col flex-1 p-5 gap-3">
            <!-- Category badge -->
            <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-slate-700" />
            <!-- Title (two lines) -->
            <div class="flex flex-col gap-1.5">
                <div class="h-4 w-full rounded-lg bg-gray-200 dark:bg-slate-700" />
                <div class="h-4 w-3/4 rounded-lg bg-gray-200 dark:bg-slate-700" />
            </div>
            <!-- Excerpt (three lines) -->
            <div class="flex flex-col gap-1.5 flex-1">
                <div class="h-3.5 w-full rounded bg-gray-100 dark:bg-slate-700/60" />
                <div class="h-3.5 w-full rounded bg-gray-100 dark:bg-slate-700/60" />
                <div class="h-3.5 w-2/3 rounded bg-gray-100 dark:bg-slate-700/60" />
            </div>
            <!-- Footer -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-slate-700">
                <div class="h-3 w-32 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-3 w-10 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
        </div>
    </div>
</template>
