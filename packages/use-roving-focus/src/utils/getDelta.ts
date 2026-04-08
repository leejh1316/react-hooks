export function getDelta(key: string, colSkipCount: number): number {
  switch (key) {
    case "ArrowRight":
      return 1;
    case "ArrowLeft":
      return -1;
    case "ArrowDown":
      return colSkipCount > 0 ? colSkipCount : 1;
    case "ArrowUp":
      return colSkipCount > 0 ? -colSkipCount : -1;
    default:
      return 0;
  }
}
