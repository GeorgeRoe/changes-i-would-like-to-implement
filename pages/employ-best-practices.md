---
layout: section
---

# Employ Best Practices

---
layout: two-cols-header
---

## `useFetch` instead of `$fetch`

::left::

```ts
export async function useFetchWithKeycloak(
  url: string,
  options: any,
  cookieName: string,
): Promise<FetchWithKeycloakResponse> {
  // useCookie doesn't need to be defined
  const userAuth = useCookie(cookieName)

  let headers: { Authorization?: string, canary?: string } = {}
  if (userAuth.value) {
    headers = { Authorization: `Bearer ${userAuth.value}` }
  }
  // ...

  let data: any, error: any
  options.headers = { ...headers, ...options?.headers }
  try {
    data = await $fetch(url, options)
  }
  catch (e) {
    console.error(e)
    error = e
  }
  return { data: ref(data), error: ref(error) }
}
```

::right::

By using `useFetch` instead of `$fetch` for (certain) API calls we get several advantages:

- Automatic handling of loading state and errors
- Caching of responses
- Automatic reactivity - if the URL or options change, the fetch will be re-executed and the component will update accordingly
- SSR deduplication (although this isn't relevant in our case as this is currently client-side only)

<style>
.two-cols-header {
  column-gap: 1rem;
}
</style>

---

## Reactivity loss

```ts
const route = useRoute()

// Reactivity lost here
const page = route.query.page

// instead this should be computed property, as it depends on another reactive source
const page = computed(() => route.query.page)
```

There are other instances where reactivity can be lost, I believe it would be a good idea to systematically look through the codebase as these errors can be easily missed and lead to bugs that are hard to track down.

---

## TypeScript Best Practices

<v-clicks>

- Opportunity to use Union Types for better type safety
  - makes impossible states unrepresentable, which prevents bugs and allows you to mirror the domain model more closely in the code
  - refactor our `Enum`s into `{} as const`s and use Union Types
  - ensure anywhere we can use a Union Type, we do
- Use of Generics to create reusable components and functions where applicable
- Type Guards to improve type safety
  - this would be especially useful when fetching data from APIs to both type the response and handle different response types
  - Even possibly implementing rust style algebraic data types (ADTs) for better handling of http responses, for example (useful in workflows perhaps?)
- Never use `any`, use `unknown` instead - this is hiding potential type errors and reduces the benefits of using TypeScript
  - This could be applicable in our `formRules.ts`

</v-clicks>

---

# Links

- [Nuxt Docs - useFetch](https://nuxt.com/docs/4.x/api/composables/use-fetch)
- [TypeScript Handbook - Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Typescript Handbook - Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [TypeScript Team Interview - Regretting implementing Enums](https://www.youtube.com/watch?v=vBJF0cJ_3G0&t=1012s)