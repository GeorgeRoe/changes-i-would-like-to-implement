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

// const { data, error } = await fetchData()
// const result = computed(() => responseIntoResult(data.value, error.value))

// This is way nicer than standard typescript enums:

export const Option = {
  A: "A",
  B: "B",
  C: "C"
} as const

export type Option = typeof Option[keyof typeof Option]

export type TwoOptions = Exclude<Option, typeof Option.C>

const someOptions: TwoOptions[] = [Option.A, Option.B]

const allOptions = Object.values(Option)

////////////////

const StepType = {
  Sweep: 'sweep',
  Loop: 'loop',
  Other: 'other'
} as const

type StepType = typeof StepType[keyof typeof StepType]

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

export const WorkflowMetadataStep = {
  Sweep: (metadata: Omit<SweepWorkflowMetadataStep, 'kind'>) => ({ ...metadata, kind: StepType.Sweep }),
  Loop: (metadata: Omit<LoopWorkflowMetadataStep, 'kind'>) => ({ ...metadata, kind: StepType.Loop }),

  isSweep: (step: WorkflowMetadataStep): step is SweepWorkflowMetadataStep => step.kind === StepType.Sweep,
  isLoop: (step: WorkflowMetadataStep): step is LoopWorkflowMetadataStep => step.kind === StepType.Loop
}

function handleStep(step: WorkflowMetadataStep) {
  if (WorkflowMetadataStep.isLoop(step)) {
    console.log(`Handling loop step with execution mode ${step.execution_mode}`)
  } else if (WorkflowMetadataStep.isSweep(step)) {
    console.log(`Handling sweep step with model version ${step.model_version}`)
  } else {
    console.log(step.name)
    console.log('Unknown step type')
  }
}