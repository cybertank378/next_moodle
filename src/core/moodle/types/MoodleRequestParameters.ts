export type MoodlePrimitive = string | number | boolean | null | undefined;

export type MoodleParameterValue =
  | MoodlePrimitive
  | readonly MoodleParameterValue[]
  | { readonly [key: string]: MoodleParameterValue };

export type MoodleRequestParameters = Readonly<
  Record<string, MoodleParameterValue>
>;
