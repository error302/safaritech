"use client";

import * as React from "react";
import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import {
  ViewRouterProvider,
  useViewRouter,
} from "@/components/site/view-router";
import { CartProvider } from "@/components/site/cart-context";
import { HomeView } from "@/components/site/home-view";
import { ShopView } from "@/components/site/shop-view";
import { ProductDetailView } from "@/components/site/product-detail-view";
import { CartView } from "@/components/site/cart-view";

function ViewSwitch() {
  const { route } = useViewRouter();

  // Key by route identity so each view gets a fresh mount when navigating
  // between different products (prevents stale state).
  const key =
    route.view === "product"
      ? `product-${route.slug}`
      : route.view === "shop"
      ? `shop-${JSON.stringify(route.query ?? {})}`
      : route.view;

  return (
    <main className="flex-1" key={key}>
      {route.view === "home" && <HomeView />}
      {route.view === "shop" && <ShopView initialQuery={route.query} />}
      {route.view === "product" && route.slug && <ProductDetailView slug={route.slug} />}
      {route.view === "cart" && <CartView />}
    </main>
  );
}

export default function Home() {
  return (
    <ViewRouterProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <SiteNavbar />
          <ViewSwitch />
          <SiteFooter />
          <CartDrawer />
        </div>
      </CartProvider>
    </ViewRouterProvider>
  );
}
