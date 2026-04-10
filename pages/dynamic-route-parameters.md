---
layout: section
---

# Dynamic Route Parameters

---

Currently our URLs look like this:

```
/data/details?version_id=123
```

- Not ideal for SEO
- Does not follow REST API Style

---

We should change this to use dynamic route parameters instead:

```
/data/123
```

- Better for SEO
- Cleaner URLs
- Follows REST API Style
- Better for analytics

---

This can be achieved in Nuxt by creating a file called `pages/data/[version_id].vue`:

```vue
<script setup lang="ts">
const route = useRoute();

const versionId = computed(() => route.params.version_id);
</script>

<template>
  <div>
    <h1>Version Details</h1>
    <p>Version ID: {{ versionId }}</p>
  </div>
</template>
```

This also has the added benefit of making it easier to understand page structure just from the filesystem.

---

New file structure:

```
pages
└── data
    ├── [version_id]
    │   ├── index.vue
    │   ├── edit.vue
    │   └── versions.vue
    ├─ index.vue
    └─ add.vue
```

This might also be an opportunity to think about the names of our parameters.
For example, currently we pass a `version_id` query param to a page called `/data/versions` which doesnt make much sense?
Maybe it should just be called `id`?

---

# Links

- [Microsoft RESTful web API design concepts](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#restful-web-api-design-concepts)
- [Nuxt Docs - useRoute](https://nuxt.com/docs/4.x/api/composables/use-route)
