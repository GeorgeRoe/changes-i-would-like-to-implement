---
layout: section
---

# SSR Friendly Authentication

---

Currently we use client-side authentication:

```ts
let keycloak: DeepReadonly<VueKeycloakInstance>
if (!import.meta.server) {
  keycloak = useKeycloak()
}
```

This stpos us from getting the benefits of Nuxt's server-side rendering capabilities.

---

This can be solved one way by using `nuxt-auth-utils`, which is what I used in my example repository:

https://github.com/GeorgeRoe/nuxt-ssr-keycloak-auth-example

- SSR friendly
- Written by Nuxt authors
- Supports Keycloak out of the box
- More resilient to malicious browser extensions