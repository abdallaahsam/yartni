# Operational Memory: Alpine.js Hydration Protocol (QAHERA-ALPINE-001)

<!-- last-verified: 2026-09-12 -->

Mandatory rules for writing Alpine.js state, templates, and interactions to guarantee 0ms hydration stalls and prevent DOM corruption.

---

## 1. Zero Attribute Logic Bloat
**Rule:** Never place large data arrays, multi-line functions, or complex logic inside inline `x-data="{ ... }"`.

### ❌ Incorrect
```html
<div x-data="{ items: [{id: 1, name: 'Item'}], filter: '', doSearch() { fetch(...); } }">
```

### ✅ Correct
```html
<div x-data="qhrSearchToolbar()">
  <!-- markup -->
</div>

<script>
document.addEventListener('alpine:init', () => {
  Alpine.data('qhrSearchToolbar', () => ({
    items: [],
    filter: '',
    init() {
      // initialize
    },
    doSearch() {
      // search logic
    }
  }));
});
</script>
```

---

## 2. Globally Unique Template Keys
**Rule:** Every iterated element in `<template x-for="...">` MUST define a globally unique `:key`. Never use a bare numeric index or generic `id` if it can collide across entity types.

### ❌ Incorrect
```html
<template x-for="(item, index) in items" :key="index">
```

### ✅ Correct
```html
<template x-for="item in items" :key="'qhr-' + item.type + '-' + item.id">
```

---

## 3. HTML5 Interactive Descendant Prohibition
**Rule:** Never place interactive elements (`<button>`, `<select>`, `<input>`, `<a>`) inside an outer `<a>` wrapper within an iterated template.

The browser's HTML parser will split the outer `<a>` tag and produce multiple root nodes, violating Alpine's single-root requirement for `template x-for` and causing silent hydration failures.

### ❌ Incorrect
```html
<template x-for="card in cards" :key="card.id">
  <a :href="card.url" class="qhr-card">
    <h3 x-text="card.title"></h3>
    <!-- Violation: nested button inside link -->
    <button @click.stop="bookmark(card.id)">Bookmark</button>
  </a>
</template>
```

### ✅ Correct
```html
<template x-for="card in cards" :key="'card-' + card.id">
  <article class="qhr-card">
    <a :href="card.url" class="qhr-card-link" x-text="card.title"></a>
    <button type="button" class="qhr-btn qhr-btn-ghost" @click="bookmark(card.id)">Bookmark</button>
  </article>
</template>
```

---

## 4. Zero Nested `x-for` Loops for Simple Lists
**Rule:** Never nest `<template x-for>` inside another `<template x-for>` for rendering simple tag/badge lists. This causes hydration stalls. Render them with helper functions or direct strings.

### ❌ Incorrect
```html
<template x-for="post in posts" :key="post.id">
  <div>
    <!-- Hydration hazard: nested x-for -->
    <template x-for="tag in post.tags" :key="tag">
      <span class="qhr-badge" x-text="tag"></span>
    </template>
  </div>
</template>
```

### ✅ Correct
```html
<template x-for="post in posts" :key="'post-' + post.id">
  <div>
    <div class="qhr-tags" x-html="renderBadges(post.tags)"></div>
  </div>
</template>
```

---

## 5. Initial State Shallow Copies & `$nextTick`
**Rule:** Initialize array states with shallow copies (`[...DATA]`), and wrap initial filter synchronizations inside `this.$nextTick()` inside `init()` to guarantee immediate 0ms first-load rendering without flickering.
