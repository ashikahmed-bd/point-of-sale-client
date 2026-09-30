<script setup>
import Default from '@/layouts/Default.vue'
</script>

<template>
  <Default>
    <main class="p-4 sm:p-5">
      <div class="mx-auto max-w-5xl">
        <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="mb-1 flex items-center gap-2 text-xs text-slate-400">
              <span>Brands</span>

              <UIcon name="i-lucide-chevron-right" class="h-3.5 w-3.5" />

              <span class="text-slate-600"> Create </span>
            </div>

            <h1 class="text-lg font-bold text-slate-900">Create Brand</h1>

            <p class="mt-0.5 text-sm text-slate-500">Add a new brand to your product catalog</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              class="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              <UIcon name="i-lucide-check" class="h-4 w-4" />

              Save Brand
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div class="space-y-5">
            <section class="rounded-xl border border-slate-200 bg-white">
              <div class="border-b border-slate-100 px-5 py-4">
                <h2 class="text-sm font-bold text-slate-900">Brand Information</h2>

                <p class="mt-0.5 text-xs text-slate-500">
                  Enter the basic information for this brand
                </p>
              </div>

              <div class="space-y-4 p-5">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Brand Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Adidas"
                    class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700"> Slug </label>

                  <div class="flex">
                    <input
                      type="text"
                      placeholder="adidas"
                      class="h-10 min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />

                    <button
                      type="button"
                      class="h-10 rounded-r-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      Generate
                    </button>
                  </div>

                  <p class="mt-1.5 text-xs text-slate-400">The slug is used in the brand URL.</p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows="7"
                    placeholder="Write a short description about this brand..."
                    class="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                  <p class="mt-1.5 text-xs text-slate-400">
                    Add a brief description that represents the brand.
                  </p>
                </div>
              </div>
            </section>

            <section class="rounded-xl border border-slate-200 bg-white">
              <div class="border-b border-slate-100 px-5 py-4">
                <h2 class="text-sm font-bold text-slate-900">Brand Logo</h2>

                <p class="mt-0.5 text-xs text-slate-500">Upload the official logo for this brand</p>
              </div>

              <div class="p-5">
                <div class="flex flex-col gap-4 sm:flex-row">
                  <div
                    class="flex h-36 w-36 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <div class="flex flex-col items-center text-center text-slate-400">
                      <UIcon name="i-lucide-image" class="h-8 w-8" />

                      <span class="mt-2 text-[11px]"> Logo Preview </span>
                    </div>
                  </div>

                  <label
                    class="flex min-h-36 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-center transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm"
                    >
                      <UIcon name="i-lucide-upload" class="h-5 w-5" />
                    </div>

                    <p class="mt-2 text-sm font-semibold text-slate-700">Upload brand logo</p>

                    <p class="mt-1 text-xs text-slate-400">Click to browse or drag and drop</p>

                    <p class="mt-2 text-[11px] text-slate-400">PNG, JPG or WEBP · Maximum 5MB</p>

                    <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" />
                  </label>
                </div>
              </div>
            </section>
          </div>

          <aside class="space-y-5">
            <section class="rounded-xl border border-slate-200 bg-white">
              <div class="border-b border-slate-100 px-5 py-4">
                <h2 class="text-sm font-bold text-slate-900">Status</h2>

                <p class="mt-0.5 text-xs text-slate-500">Control brand visibility</p>
              </div>

              <div class="p-5">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-semibold text-slate-800">Active Brand</p>

                    <p class="mt-0.5 text-xs leading-4 text-slate-500">
                      Make this brand available in your catalog.
                    </p>
                  </div>

                  <div class="relative h-5 w-9 shrink-0 rounded-full bg-primary">
                    <div
                      class="absolute left-[18px] top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="rounded-xl border border-slate-200 bg-white">
              <div class="border-b border-slate-100 px-5 py-4">
                <h2 class="text-sm font-bold text-slate-900">Preview</h2>

                <p class="mt-0.5 text-xs text-slate-500">Brand appearance</p>
              </div>

              <div class="p-5">
                <div
                  class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm"
                  >
                    <UIcon name="i-lucide-award" class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-800">Brand Name</p>

                    <p class="mt-0.5 truncate text-xs text-slate-400">/brand-slug</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <div class="flex gap-3">
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                >
                  <UIcon name="i-lucide-info" class="h-4 w-4" />
                </div>

                <div>
                  <p class="text-sm font-semibold text-slate-800">Brand logo</p>

                  <p class="mt-1 text-xs leading-5 text-slate-500">
                    Use a clear square or transparent logo for the best appearance across your
                    store.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div class="mt-5 flex items-center justify-end gap-2 border-t border-slate-200 pt-5">
          <button
            type="button"
            class="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            class="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <UIcon name="i-lucide-check" class="h-4 w-4" />

            Save Brand
          </button>
        </div>
      </div>
    </main>
  </Default>
</template>
