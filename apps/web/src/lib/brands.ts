export type Brand = {
  name: string;
  /** Simple Icons slug — https://simpleicons.org */
  icon?: string;
  /** Local logo in /public/brands when not on Simple Icons */
  logoSrc?: string;
  /** Icon color on dark tile (hex without #) */
  iconColor?: string;
  popular?: boolean;
};

export const BRANDS: Brand[] = [
  { name: "Samsung", icon: "samsung", iconColor: "1428A0", popular: true },
  { name: "Apple", icon: "apple", iconColor: "FFFFFF", popular: true },
  { name: "Sony", icon: "sony", iconColor: "FFFFFF", popular: true },
  { name: "HP", icon: "hp", iconColor: "0096D6" },
  { name: "Dell", icon: "dell", iconColor: "007DB8" },
  { name: "JBL", icon: "jbl", iconColor: "FF3300", popular: true },
  { name: "Xiaomi", icon: "xiaomi", iconColor: "FF6900", popular: true },
  { name: "Infinix", logoSrc: "/brands/infinix.svg", popular: true },
  { name: "Tecno", logoSrc: "/brands/tecno.svg" },
  { name: "Lenovo", icon: "lenovo", iconColor: "E2231A" },
  { name: "Google", icon: "google", iconColor: "4285F4" },
  { name: "Nintendo", icon: "nintendo", iconColor: "E4000F" },
];

export function getBrandIconUrl(brand: Brand): string | null {
  if (brand.logoSrc) return brand.logoSrc;
  if (brand.icon) {
    const color = brand.iconColor ?? "FFFFFF";
    return `https://cdn.simpleicons.org/${brand.icon}/${color.replace("#", "")}`;
  }
  return null;
}

export function findBrandByName(name: string): Brand | undefined {
  return BRANDS.find((b) => b.name.toLowerCase() === name.toLowerCase());
}
