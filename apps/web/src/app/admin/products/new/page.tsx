import { redirect } from "next/navigation";

// This route redirects to the products page where the create modal opens.
// Kept as a convenience route for direct navigation.
export default function AdminProductsNew() {
  redirect("/admin/products?action=create");
}
