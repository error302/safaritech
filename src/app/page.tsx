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
import { SettingsProvider } from "@/components/site/settings-context";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/admin-auth";
import { HomeView } from "@/components/site/home-view";
import { ShopView } from "@/components/site/shop-view";
import { ProductDetailView } from "@/components/site/product-detail-view";
import { CartView } from "@/components/site/cart-view";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminShell } from "@/components/admin/admin-shell";

function ViewSwitch() {
  const { route } = useViewRouter();

  // Admin route — no navbar/footer, full-screen
  if (route.view === "admin") {
    return <AdminView />;
  }

  const key =
    route.view === "product"
      ? `product-${route.slug}`
      : route.view === "shop"
      ? `shop-${JSON.stringify(route.query ?? {})}`
      : route.view;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1" key={key}>
        {route.view === "home" && <HomeView />}
        {route.view === "shop" && <ShopView initialQuery={route.query} />}
        {route.view === "product" && route.slug && <ProductDetailView slug={route.slug} />}
        {route.view === "cart" && <CartView />}
      </main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}

function AdminView() {
  const { isAuthed } = useAdminAuth();
  return isAuthed ? <AdminShell /> : <AdminLogin />;
}

export default function Home() {
  return (
    <ViewRouterProvider>
      <SettingsProvider>
        <CartProvider>
          <AdminAuthProvider>
            <ViewSwitch />
          </AdminAuthProvider>
        </CartProvider>
      </SettingsProvider>
    </ViewRouterProvider>
  );
}
