<template>
  <main class="mx-auto min-h-screen max-w-5xl px-6 py-12">
    <header class="mb-8 flex items-center justify-between gap-4">
      <div>
        <p class="m-0 text-3 uppercase tracking-3 color-slate-500">MonoHouse</p>
        <h1 class="m-0 text-8 font-700">
          <slot name="title" />
        </h1>
      </div>
    </header>

    <slot />
  </main>
</template>
