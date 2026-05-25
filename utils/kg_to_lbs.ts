const LBS_IN_KG = 2.205;

export function KgToLbs(val: number | string): number {
  return (val as number) * LBS_IN_KG;
}

export function LbsToKg(val: number | string): number {
  return (val as number) / LBS_IN_KG;
}
