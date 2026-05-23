export type Brand = {
  name: string;
  /** Logo URL — can be a remote CDN URL or a local path */
  logoSrc: string;
  /** Whether the logoSrc is a remote URL (needs unoptimized Image) */
  isRemote?: boolean;
  /** Icon color on dark tile (hex without #) — for CDN fallback */
  iconColor?: string;
  popular?: boolean;
};

export const BRANDS: Brand[] = [
  { name: "Samsung", logoSrc: "https://cdn.simpleicons.org/samsung/1428A0", isRemote: true, iconColor: "1428A0", popular: true },
  { name: "Apple", logoSrc: "https://cdn.simpleicons.org/apple/FFFFFF", isRemote: true, iconColor: "FFFFFF", popular: true },
  { name: "Sony", logoSrc: "https://cdn.simpleicons.org/sony/FFFFFF", isRemote: true, iconColor: "FFFFFF", popular: true },
  { name: "HP", logoSrc: "https://cdn.simpleicons.org/hp/0096D6", isRemote: true, iconColor: "0096D6" },
  { name: "Dell", logoSrc: "https://cdn.simpleicons.org/dell/007DB8", isRemote: true, iconColor: "007DB8" },
  { name: "JBL", logoSrc: "https://cdn.simpleicons.org/jbl/FF3300", isRemote: true, iconColor: "FF3300", popular: true },
  { name: "Xiaomi", logoSrc: "https://cdn.simpleicons.org/xiaomi/FF6900", isRemote: true, iconColor: "FF6900", popular: true },
  { name: "Infinix", logoSrc: "/brands/infinix.svg", iconColor: "FFFFFF", popular: true },
  { name: "Tecno", logoSrc: "/brands/tecno.svg", iconColor: "3B82F6" },
  { name: "Lenovo", logoSrc: "https://cdn.simpleicons.org/lenovo/E2231A", isRemote: true, iconColor: "E2231A" },
  { name: "Google", logoSrc: "https://cdn.simpleicons.org/google/4285F4", isRemote: true, iconColor: "4285F4" },
  { name: "Nintendo", logoSrc: "https://cdn.simpleicons.org/nintendo/E4000F", isRemote: true, iconColor: "E4000F" },
];

export function getBrandIconUrl(brand: Brand): string {
  return brand.logoSrc;
}

export function findBrandByName(name: string): Brand | undefined {
  return BRANDS.find((b) => b.name.toLowerCase() === name.toLowerCase());
}
