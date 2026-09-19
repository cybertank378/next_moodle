export type MoodleParameterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly MoodleParameterValue[]
  | { readonly [key: string]: MoodleParameterValue };

export type MoodleRequestParameters = Readonly<
  Record<string, MoodleParameterValue>
>;
