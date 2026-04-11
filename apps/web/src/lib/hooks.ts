'use client'

import { useState } from 'react'
import { trpc } from '@/utils/trpc'

export function useProducts() {
  const [category, setCategory] = useState<string | undefined>()
  const [search, setSearch] = useState<string | undefined>()

  const { data, isLoading, error } = trpc.product.getAll.useQuery({
    category,
    search,
    limit: 50,
  })

  return {
    products: data?.products ?? [],
    isLoading,
    error,
    category,
    setCategory,
    search,
    setSearch,
  }
}

export function useProduct(slug: string) {
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug })
  return { product, isLoading }
}

export function useFeaturedProducts() {
  const { data: products, isLoading } = trpc.product.getFeatured.useQuery()
  return { products: products ?? [], isLoading }
}

export function useCart() {
  const utils = trpc.useUtils()
  
  const { data: cart } = trpc.cart.getCart.useQuery()
  const addItem = trpc.cart.addItem.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  })
  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  })
  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  })

  return {
    cart,
    addItem: (productId: string, quantity: number) => addItem.mutate({ productId, quantity }),
    removeItem: (itemId: string) => removeItem.mutate({ itemId }),
    updateQuantity: (itemId: string, quantity: number) => updateQuantity.mutate({ itemId, quantity }),
    isLoading: addItem.isPending || removeItem.isPending || updateQuantity.isPending,
  }
}

export function useCategories() {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery()
  return { categories: categories ?? [], isLoading }
}