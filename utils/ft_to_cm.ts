const MULTIPLIER = 30.48;

export function FtToCm(ft: number) {
  return ft * MULTIPLIER;
}

export function CmToFt(cm: number) {
  return cm / MULTIPLIER;
}
