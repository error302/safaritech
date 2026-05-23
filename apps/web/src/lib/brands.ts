export type Brand = {
  name: string;
  /** Logo URL — local path under /brands/ */
  logoSrc: string;
  /** Brand accent color (hex without #) for fallback/placeholder */
  iconColor?: string;
  popular?: boolean;
};

export const BRANDS: Brand[] = [
  { name: "Samsung", logoSrc: "/brands/samsung.svg", iconColor: "1428A0", popular: true },
  { name: "Apple", logoSrc: "/brands/apple.svg", iconColor: "FFFFFF", popular: true },
  { name: "Sony", logoSrc: "/brands/sony.svg", iconColor: "FFFFFF", popular: true },
  { name: "HP", logoSrc: "/brands/hp.svg", iconColor: "0096D6" },
  { name: "Dell", logoSrc: "/brands/dell.svg", iconColor: "007DB8" },
  { name: "JBL", logoSrc: "/brands/jbl.svg", iconColor: "FF3300", popular: true },
  { name: "Xiaomi", logoSrc: "/brands/xiaomi.svg", iconColor: "FF6900", popular: true },
  { name: "Infinix", logoSrc: "/brands/infinix.svg", iconColor: "FFFFFF", popular: true },
  { name: "Tecno", logoSrc: "/brands/tecno.svg", iconColor: "3B82F6" },
  { name: "Lenovo", logoSrc: "/brands/lenovo.svg", iconColor: "E2231A" },
  { name: "Google", logoSrc: "/brands/google.svg", iconColor: "4285F4" },
  { name: "Nintendo", logoSrc: "/brands/nintendo.svg", iconColor: "E4000F" },
];

export function getBrandIconUrl(brand: Brand): string {
  return brand.logoSrc;
}

export function findBrandByName(name: string): Brand | undefined {
  return BRANDS.find((b) => b.name.toLowerCase() === name.toLowerCase());
}
