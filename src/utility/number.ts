export function formatNumber(num: number | string | bigint): string {
  if (typeof num === "bigint") {
    num = parseInt(num.toString());
  }

  if (typeof num === "string") {
    num = parseInt(num);
  }

  if (isNaN(num)) {
    return "";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(Number(num));
}
