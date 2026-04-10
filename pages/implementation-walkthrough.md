---
layout: section
---

# Implementation Walkthrough

---
layout: section
---

## Pinia Store Refactor

---

With the new Auth implementation, we would have composables such as this for each API:

```ts
export const useNidFetch = createUseFetch({
  baseURL: '/api/nid', // /api/nid is the proxied endpoint for the NID API
})

// export function nidFetch...
```

---

````md magic-move

```ts {|2,6,7,14|6,9,15|6,8,16|3-5,11-13|}
export const useDataDetailsStore = defineStore('dataDetails', () => {
  const dataset: Ref<DataDetailsApiResponse | null> = ref(null)
  const deleteLoading: Ref<boolean> = ref(false)
  const deleteSuccess: Ref<boolean> = ref(false)
  const deleteDatasetErrors: Ref<Array<string>> = ref([])
  const loading: Ref<boolean> = ref(false)
  const fetchDatasetErrors: Ref<Array<string>> = ref([])
  const updateVersionTagErrors: Ref<Array<string>> = ref([])
  const datasets: Ref<Array<DataDetailsApiResponse>> = ref([])

  async function _delete(url: string) {}
  async function deleteDataset(datasetId: string) {}
  async function deleteDatasetVersion(versionId: string) {}
  async function fetchDataset(versionId: string) {}
  async function fetchDatasets(versionIds: Array<string>): Promise<void> {}
  async function updateVersionTag(versionId: string, action: VersionTagAction, tagName: VersionTagName) {}

  return { /* ... */ }
})
```

```ts
export const useDataDetailsStore = defineStore('dataDetails', () => {
  const deleteLoading: Ref<boolean> = ref(false)
  const deleteSuccess: Ref<boolean> = ref(false)
  const deleteDatasetErrors: Ref<Array<string>> = ref([])
  const loading: Ref<boolean> = ref(false)
  const updateVersionTagErrors: Ref<Array<string>> = ref([])
  const datasets: Ref<Array<DataDetailsApiResponse>> = ref([])

  async function _delete(url: string) {}
  async function deleteDataset(datasetId: string) {}
  async function deleteDatasetVersion(versionId: string) {}
  async function fetchDatasets(versionIds: Array<string>): Promise<void> {}
  async function updateVersionTag(versionId: string, action: VersionTagAction, tagName: VersionTagName) {}

  return { /* ... */ }
})

export function useDataset(id: MaybeRefOrGetter<string>) {
  return useNidFetch(`/nid/metadata/${toValue(id)}/`)
} // we get the loading and error states for free with useFetch
```

```ts
export const useDataDetailsStore = defineStore('dataDetails', () => {
  const deleteLoading: Ref<boolean> = ref(false)
  const deleteSuccess: Ref<boolean> = ref(false)
  const deleteDatasetErrors: Ref<Array<string>> = ref([])
  const loading: Ref<boolean> = ref(false)
  const updateVersionTagErrors: Ref<Array<string>> = ref([])

  async function _delete(url: string) {}
  async function deleteDataset(datasetId: string) {}
  async function deleteDatasetVersion(versionId: string) {}
  async function updateVersionTag(versionId: string, action: VersionTagAction, tagName: VersionTagName) {}

  return { /* ... */ }
})

export function useDataset(id: MaybeRefOrGetter<string>) {
  return useNidFetch(() => `/nid/metadata/${toValue(id)}/`)
} // we get the loading and error states for free with useFetch

export function useDatasets(ids: MaybeRefOrGetter<Array<string>>) {
  // place Semaphore logic here, or ideally just create a new endpoint for fetching multiple datasets at once
}
```

```ts
export const useDataDetailsStore = defineStore('dataDetails', () => {
  const deleteLoading: Ref<boolean> = ref(false)
  const deleteSuccess: Ref<boolean> = ref(false)
  const deleteDatasetErrors: Ref<Array<string>> = ref([])

  async function _delete(url: string) {}
  async function deleteDataset(datasetId: string) {}
  async function deleteDatasetVersion(versionId: string) {}

  return { /* ... */ }
})

export function useDataset(id: MaybeRefOrGetter<string>) {
  return useNidFetch(() => `/nid/metadata/${toValue(id)}/`)
} // we get the loading and error states for free with useFetch

export function useDatasets(ids: MaybeRefOrGetter<Array<string>>) {
  // place Semaphore logic here, or ideally just create a new endpoint for fetching multiple datasets at once
}

// plain async function for one-off operations
// these can always be wrapped with useAsyncData when reactivity is required
export async function updateVersionTag(versionId: string, action: VersionTagAction, tagName: VersionTagName) {}
```

```ts
export async function deleteDataset(datasetId: string) {}
export async function deleteDatasetVersion(versionId: string) {}

export function useDataset(id: MaybeRefOrGetter<string>) {
  return useNidFetch(() => `/nid/metadata/${toValue(id)}/`)
} // we get the loading and error states for free with useFetch

export function useDatasets(ids: MaybeRefOrGetter<Array<string>>) {
  // place Semaphore logic here, or ideally just create a new endpoint for fetching multiple datasets at once
}

// plain async function for one-off operations
// these can always be wrapped with useAsyncData when reactivity is required
export async function updateVersionTag(versionId: string, action: VersionTagAction, tagName: VersionTagName) {}
```

```ts
// ~/lib/dataset.ts
export async function deleteDataset(datasetId: string) {}
export async function deleteDatasetVersion(versionId: string) {}
export async function updateVersionTag(versionId: string, action: VersionTagAction, tagName: VersionTagName) {}

// ~/composables/useDataset.ts
export function useDataset(id: MaybeRefOrGetter<string>) {
  return useNidFetch(() => `/nid/metadata/${toValue(id)}/`)
}

// ~/composables/useDatasets.ts
export function useDatasets(ids: MaybeRefOrGetter<Array<string>>) {
  // ...
}
```

````

---
layout: statement
---

This implementation would make pages in charge of data orchestration.
Instead of every component in the tree all using the same store, data would be passed down through components as props.

---
layout: section
---

## Advanced Type Safety

---

````md magic-move

```ts
enum StepType {
  MODEL = 'model',
  SWEEP = 'sweep',
  PUBLISH = 'publisher',
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  VISUALISATION = 'visualisation',
  START = 'Start',
  LOOP = 'loop',
}
```

```ts
enum StepType {
  Model = 'model',
  Sweep = 'sweep',
  Publish = 'publisher',
  Sequential = 'sequential',
  Parallel = 'parallel',
  Visualisation = 'visualisation',
  Start = 'Start',
  Loop = 'loop',
}
```

```ts
const StepType = {
  Model: 'model',
  Sweep: 'sweep',
  Publish: 'publisher',
  Sequential: 'sequential',
  Parallel: 'parallel',
  Visualisation: 'visualisation',
  Start: 'Start',
  Loop: 'loop',
} as const

type StepType = typeof StepType[keyof typeof StepType]
```

````

---

````md magic-move

```ts
export interface BaseWorkflowMetadataStep {
  kind: string
  name: string
  position: {
    x: number
    y: number
  }
  dependencies: Array<string>
}

export interface LoopWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  execution_mode: string
  workflow_version: string
}

export interface SweepWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  inputs: Array<string>
  model_version: string
}
```

```ts
export interface BaseWorkflowMetadataStep {
  kind: string
  name: string
  position: {
    x: number
    y: number
  }
  dependencies: Array<string>
}

export interface LoopWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  execution_mode: string
  workflow_version: string
}

export interface SweepWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  inputs: Array<string>
  model_version: string
}

// no error...
const test: SweepWorkflowMetadataStep = {
  kind: "Some random string that means nothing!",
  // ...
}
```

```ts
export interface BaseWorkflowMetadataStep {
  kind: string
  name: string
  position: {
    x: number
    y: number
  }
  dependencies: Array<string>
}

export interface LoopWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  execution_mode: string
  workflow_version: string
}

export interface SweepWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  inputs: Array<string>
  model_version: string
}
```

```ts
export interface BaseWorkflowMetadataStep {
  name: string
  position: {
    x: number
    y: number
  }
  dependencies: Array<string>
}

export interface LoopWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  kind: typeof StepType.Loop
  execution_mode: string
  workflow_version: string
}

export interface SweepWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  kind: typeof StepType.Sweep
  inputs: Array<string>
  model_version: string
}
```

```ts
export interface BaseWorkflowMetadataStep {
  name: string
  position: {
    x: number
    y: number
  }
  dependencies: Array<string>
}

export interface LoopWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  kind: typeof StepType.Loop
  execution_mode: string
  workflow_version: string
}

export interface SweepWorkflowMetadataStep extends BaseWorkflowMetadataStep {
  kind: typeof StepType.Sweep
  inputs: Array<string>
  model_version: string
}

export type WorkflowMetadataStep = LoopWorkflowMetadataStep | SweepWorkflowMetadataStep
```

```ts
export type WorkflowMetadataStep = LoopWorkflowMetadataStep | SweepWorkflowMetadataStep
```

```ts
export type WorkflowMetadataStep = LoopWorkflowMetadataStep | SweepWorkflowMetadataStep

export const WorkflowMetadataStep = {
  // We can add helper functions here
  // This is nice to use as we can import both the type and the helper functions under one name
}
```

```ts
export type WorkflowMetadataStep = LoopWorkflowMetadataStep | SweepWorkflowMetadataStep

export const WorkflowMetadataStep = {
  Loop: (step: Omit<LoopWorkflowMetadataStep, 'kind'>): LoopWorkflowMetadataStep => ({
    ...step,
    kind: StepType.Loop,
  }),
  Sweep: (step: Omit<SweepWorkflowMetadataStep, 'kind'>): SweepWorkflowMetadataStep => ({
    ...step,
    kind: StepType.Sweep,
  }),

  isSweep: (step: WorkflowMetadataStep): step is SweepWorkflowMetadataStep => step.kind === StepType.Sweep,
  isLoop: (step: WorkflowMetadataStep): step is LoopWorkflowMetadataStep => step.kind === StepType.Loop
}
```

````

---

````md magic-move

```ts
const step = WorkflowMetadataStep.Loop({
  name: 'My Loop Step',
  position: { x: 0, y: 0 },
  dependencies: [],
  execution_mode: 'sequential',
  workflow_version: '1.0',
})
```

```ts
const step = WorkflowMetadataStep.Loop({
  name: 'My Loop Step',
  position: { x: 0, y: 0 },
  dependencies: [],
  execution_mode: 'sequential',
  workflow_version: '1.0',
})

// This works, as Loop() returns a LoopWorkflowMetadataStep
console.log(step.execution_mode)
```

```ts
const step: WorkflowMetadataStep = WorkflowMetadataStep.Loop({
  name: 'My Loop Step',
  position: { x: 0, y: 0 },
  dependencies: [],
  execution_mode: 'sequential',
  workflow_version: '1.0',
})

// Property 'execution_mode' does not exist on type 'WorkflowMetadataStep'.
console.log(step.execution_mode)
```

```ts
const step: WorkflowMetadataStep = WorkflowMetadataStep.Loop({
  name: 'My Loop Step',
  position: { x: 0, y: 0 },
  dependencies: [],
  execution_mode: 'sequential',
  workflow_version: '1.0',
})

if (WorkflowMetadataStep.isLoop(step)) {
  // TypeScript now knows that step is a LoopWorkflowMetadataStep, so we can access execution_mode without error
  console.log(step.execution_mode)
} else if (WorkflowMetadataStep.isSweep(step)) {
  // TypeScript now knows that step is a SweepWorkflowMetadataStep, so we can access model_version without error
  console.log(step.model_version)
} else {
  // Property 'name' does not exist on type 'never'.
  console.log(step.name)
}
```

````

---

```ts
type OkResult<T> = { ok: true; value: T }
type ErrorResult<E = unknown> = { ok: false; error: E }
type Result<T, E> = OkResult<T> | ErrorResult<E>

export const Result = {
  Ok: <T, E = unknown>(value: T): Result<T, E> => ({ ok: true, value }),
  Error: <T, E = unknown>(error: E): Result<T, E> => ({ ok: false, error }),

  isOk: <T, E = unknown>(result: Result<T, E>): result is OkResult<T> => result.ok,
  isError: <T, E = unknown>(result: Result<T, E>): result is ErrorResult<E> => !result.ok
}

function responseIntoResult<T, E>(value?: T, error?: E): Result<T, E> | null {
  if (value !== undefined) {
    return Result.Ok(value)
  } else if (error !== undefined) {
    return Result.Error(error)
  } else {
    return null
  }
}
```