# Changes I Would Like To Implement

## Notes

These were the original points I showed Lizzie

- Use Nuxt dynamic route parameters instead of query parameters for better SEO and cleaner URLs (REST API style)
- Change authentication to be SSR friendly
- Reduce use of pinia stores
  - Pinia stores currently act as a global state management that half of all components (68/117) import, making testing and maintenance more difficult
  - At the page level: use composables for fetching data and managing state
  - At the component level: use props and emits for state management
  - Stores can remain for global state that is shared across many components, such as notifications
- remove instances of `$fetch` and replace with `useFetch` or `useAsyncData` where appropriate
- type based props declaration
- eventually add `nuxt typecheck` to CI (and precommit hooks) - cannot right now as there are over 1k type errors
- Ensure tests are testing our code, and not Nuxt
  - I have spotted a few tests for components where all the test does is check that its props are a certain value, instead of whether the props are being rendered to DOM
- Add OpenAPI spec for all backend API endpoints, and use `openapi-typescript` (or other library) to generate types for API responses
- remove all instances of `any`, all types should be properly defined, and when impossible use `unknown` instead with type guards
- ensure that all utility functions (especially from the old codebase) are properly typed
  - I have spotted a few utility functions that are typed as `any` when they should be taking a generic type parameter instead
- ensure that SOLID principles are being followed where applicable
  - e.g., a function that does something or returns a default is doing too much (and making typeing difficult)
- comments
  - add comments to functions with complex logic, and to any code that is not self explanatory
- use more "advanced" TypeScript features to ensure absolute type safety
  - e.g., in some components there are two props for `isFullAccess` and `isPending`, this should be an enum to ensure mutual exclusivity
- Don't know why there is a bunch of query params to do with keycloak