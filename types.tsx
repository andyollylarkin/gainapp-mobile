export type MaxFourNonEmptyArray<T> = [T, T, T] | [T, T, T, T];
export type NonEmptyArray<T> = [T, ...T[]];

export class StartTimerEvent {
  constructor(
    public readonly id: string,
    public readonly timestamp: number,
    public readonly duration: number,
  ) {}
}

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
