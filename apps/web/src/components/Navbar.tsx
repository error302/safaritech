"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/utils/trpc";
import {
Search,
ShoppingCart,
User,
Menu,
X,
Smartphone,
Laptop,
Gamepad2,
Headphones,
Flame,
MapPin,
ChevronDown,
Package,
} from "lucide-react";

export default function Navbar() {
const [mobileOpen, setMobileOpen] = useState(false);

const { data: cart } = trpc.cart.getCart.useQuery();
const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

return (
<>
<nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-4">
<div className="flex items-center justify-between h-16 gap-4">
<Link href="/" className="flex items-center gap-2.5 shrink-0">
<Image
src="/logo.jpg"
alt="Safaritech"
width={32}
height={32}
className="rounded-lg object-cover"
/>
<span className="font-display font-bold text-xl tracking-tight text-gray-900">
Safari<span className="text-neon">tech</span>
</span>
</Link>

<div className="hidden md:flex flex-1 max-w-xl mx-4">
<div className="relative w-full group">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-gray-600 transition-colors" />
<input
type="text"
placeholder="Search phones, laptops, gaming gear..."
className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
/>
</div>
</div>

<div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
<Link href="/shop?cat=phones" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
<Smartphone className="w-3.5 h-3.5" /> Phones
</Link>
<Link href="/shop?cat=laptops" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
<Laptop className="w-3.5 h-3.5" /> Laptops
</Link>
<Link href="/shop?cat=gaming" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
<Gamepad2 className="w-3.5 h-3.5" /> Gaming
</Link>
<Link href="/shop?cat=accessories" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
<Headphones className="w-3.5 h-3.5" /> Accessories
</Link>
</div>

<div className="flex items-center gap-2 shrink-0">
<Link href="/checkout" className="hidden md:flex items-center gap-1.5 bg-green-600 hover:bg-green-700 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
<Smartphone className="w-3.5 h-3.5" />
M-Pesa
</Link>

<Link href="/cart" className="hidden md:flex relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
<ShoppingCart className="w-5 h-5" />
{cartCount > 0 && (
<span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
{cartCount}
</span>
)}
</Link>

<Link href="/account" className="hidden md:block p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
<User className="w-5 h-5" />
</Link>

<button
className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
onClick={() => setMobileOpen(!mobileOpen)}
>
{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
</button>
</div>
</div>

<div className="hidden md:flex items-center gap-1 py-2 border-t border-gray-100 text-sm overflow-x-auto">
{[
{ label: "All Products", href: "/shop" },
{ label: "Phones", href: "/shop?cat=phones", icon: Smartphone },
{ label: "Samsung", href: "/shop?q=samsung" },
{ label: "Apple", href: "/shop?q=apple" },
{ label: "Laptops", href: "/shop?cat=laptops", icon: Laptop },
{ label: "Gaming PCs", href: "/shop?cat=gaming", icon: Gamepad2 },
{ label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
{ label: "Deals", href: "/shop?filter=deals", icon: Flame },
].map((item) => (
<Link
key={item.label}
href={item.href}
className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all text-xs font-medium"
>
{item.icon && <item.icon className="w-3 h-3" />}
{item.label}
</Link>
))}
</div>
</div>

{mobileOpen && (
<div className="md:hidden border-t border-gray-100 bg-white">
<div className="px-4 py-3 space-y-3">
<div className="flex items-center gap-2">
<MapPin className="w-4 h-4 text-gray-400" />
<span className="text-xs text-gray-600">Nairobi, Kenya</span>
</div>
<div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
<input
type="text"
placeholder="Search Safaritech..."
className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
/>
</div>
</div>
<div className="px-4 pb-4 flex flex-col gap-1">
{[
{ label: "All Products", href: "/shop", icon: Package },
{ label: "Phones", href: "/shop?cat=phones", icon: Smartphone },
{ label: "Laptops & PCs", href: "/shop?cat=laptops", icon: Laptop },
{ label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
{ label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
{ label: "Deals", href: "/shop?filter=deals", icon: Flame },
].map((item) => (
<Link
key={item.label}
href={item.href}
className="flex items-center justify-between py-3 px-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
onClick={() => setMobileOpen(false)}
>
<span className="flex items-center gap-3">
{item.icon && <item.icon className="w-4 h-4 text-gray-400" />}
{item.label}
</span>
<ChevronDown className="w-4 h-4 text-gray-300 -rotate-90" />
</Link>
))}
</div>
</div>
)}
</nav>
</>
);
}
