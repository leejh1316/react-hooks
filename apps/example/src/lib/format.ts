export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatCount(value: number) {
  return value.toLocaleString("ko-KR");
}

/** 데모용 가짜 네트워크 지연 */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
