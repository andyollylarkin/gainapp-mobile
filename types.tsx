export type MaxFourNonEmptyArray<T> = [T, T, T] | [T, T, T, T];
export type NonEmptyArray<T> = [T, ...T[]];

export type PositiveNumber = number & { __brand: "PositiveNumber" };

export class StartTimerEvent {
  constructor(
    public readonly id: string,
    public readonly timestamp: number,
    public readonly duration: number,
  ) {}
}

export enum DayEnum {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

const DAY_ORDER: DayEnum[] = [
  DayEnum.Monday,
  DayEnum.Tuesday,
  DayEnum.Wednesday,
  DayEnum.Thursday,
  DayEnum.Friday,
  DayEnum.Saturday,
  DayEnum.Sunday,
];

export class Day {
  constructor(public readonly name: DayEnum) {}

  static values(): Day[] {
    return DAY_ORDER.map((day) => new Day(day));
  }

  static map<T>(callback: (day: Day, index: number) => T): T[] {
    return Day.values().map(callback);
  }

  static fromString(dayStr: keyof typeof DayEnum): Day {
    const dayEnumValue = (Object.values(DayEnum) as string[]).find(
      (day) => day.toLowerCase() === dayStr.toLowerCase(),
    );

    if (!dayEnumValue) {
      throw new Error(`Invalid day string: ${dayStr}`);
    }

    return new Day(dayEnumValue as DayEnum);
  }

  static fromNumber(dayNum: number): Day {
    const normalized = (((Math.trunc(dayNum) - 1) % 7) + 7) % 7;
    return new Day(DAY_ORDER[normalized]);
  }

  static toNumber(day: Day | keyof typeof DayEnum): number {
    const dayName = day instanceof Day ? day.name : DayEnum[day];
    const index = DAY_ORDER.indexOf(dayName as DayEnum);
    if (index === -1) {
      throw new Error(`Invalid day: ${dayName}`);
    }
    return index + 1;
  }

  nextDay(): Day {
    const dayValues = Object.values(DayEnum);
    const currentIndex = dayValues.indexOf(this.name);
    const nextIndex = (currentIndex + 1) % dayValues.length;
    return new Day(dayValues[nextIndex] as DayEnum);
  }
}
