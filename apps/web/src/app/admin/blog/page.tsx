"use client";

import { useState, useCallback } from "react";
import {
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { type Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploader from "@/components/admin/ImageUploader";

// ─── Types ───────────────────────────────────────────────────────────────────

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDesc: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  author: { name: string } | null;
};

type FormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  seoTitle: string;
  seoDesc: string;
  published: boolean;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featuredImage: "",
  seoTitle: "",
  seoDesc: "",
  published: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(date: Date | string | null): string {
  if (!date) return "Draft";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Draft";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Input field helper ─────────────────────────────────────────────────────

function FormField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-safariborder bg-safaridark px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon/30 transition-all";

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const utils = trpc.useUtils();

  // ── Queries & Mutations ─────────────────────────────────────────────────

  const { data: posts, isLoading, error: queryError } = trpc.blog.getAllForAdmin.useQuery();

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.getAllForAdmin.invalidate();
      closeFormModal();
    },
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.getAllForAdmin.invalidate();
      closeFormModal();
    },
  });

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => {
      utils.blog.getAllForAdmin.invalidate();
      setDeleteConfirmId(null);
    },
  });

  // ── Local State ─────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Derived Data ────────────────────────────────────────────────────────

  const allPosts = (posts ?? []) as BlogPost[];

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.published) ||
      (statusFilter === "draft" && !post.published);
    return matchesSearch && matchesStatus;
  });

  // ── Form Handlers ───────────────────────────────────────────────────────

  const closeFormModal = useCallback(() => {
    setFormOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
    setSlugManuallyEdited(false);
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingPost(null);
    setForm(emptyForm);
    setSlugManuallyEdited(false);
    setFormOpen(true);
  }, []);

  const openEditModal = useCallback((post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content ?? "",
      excerpt: post.excerpt ?? "",
      featuredImage: post.featuredImage ?? "",
      seoTitle: post.seoTitle ?? "",
      seoDesc: post.seoDesc ?? "",
      published: post.published,
    });
    setSlugManuallyEdited(true); // don't auto-slug when editing
    setFormOpen(true);
  }, []);

  const handleTitleChange = useCallback(
    (value: string) => {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: slugManuallyEdited ? prev.slug : slugify(value),
      }));
    },
    [slugManuallyEdited]
  );

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) || value.toLowerCase().trim() }));
  }, []);

  const handleSave = useCallback(() => {
    if (!form.title.trim()) return;

    if (editingPost) {
      updatePost.mutate({
        id: editingPost.id,
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || undefined,
        featuredImage: form.featuredImage || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDesc: form.seoDesc || undefined,
        published: form.published,
      });
    } else {
      createPost.mutate({
        title: form.title,
        slug: form.slug || slugify(form.title),
        content: form.content,
        excerpt: form.excerpt || undefined,
        featuredImage: form.featuredImage || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDesc: form.seoDesc || undefined,
      });
    }
  }, [form, editingPost, createPost, updatePost]);

  const togglePublish = useCallback(
    (post: BlogPost) => {
      updatePost.mutate({
        id: post.id,
        published: !post.published,
      });
    },
    [updatePost]
  );

  // ── Mutation State ──────────────────────────────────────────────────────

  const isSaving = createPost.isPending || updatePost.isPending;
  const saveError = createPost.error?.message || updatePost.error?.message;

  // ── Table Columns ───────────────────────────────────────────────────────

  const columns: Column<BlogPost>[] = [
    {
      key: "title",
      label: "Title",
      render: (row: BlogPost) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-safaridark shrink-0 border border-safariborder">
            {row.featuredImage ? (
              <img
                src={row.featuredImage}
                alt={row.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">
                No img
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate max-w-[260px]">{row.title}</p>
            <p className="text-xs text-gray-500 truncate max-w-[260px]">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (row: BlogPost) => (
        <span className="text-gray-400">{row.author?.name || "Unknown"}</span>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (row: BlogPost) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.published
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.published ? "bg-emerald-400" : "bg-yellow-400"
            }`}
          />
          {row.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "publishedAt",
      label: "Date",
      render: (row: BlogPost) => (
        <span className={`${row.publishedAt ? "text-gray-400" : "text-gray-600 italic"}`}>
          {formatDate(row.publishedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: BlogPost) => (
        <div className="flex items-center justify-end gap-1">
          {row.published && (
            <a
              href={`/blog/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
              aria-label="View post"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {!row.published && (
            <a
              href={`/blog/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
              aria-label="Preview post"
            >
              <Eye className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => togglePublish(row)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
            aria-label={row.published ? "Unpublish post" : "Publish post"}
            title={row.published ? "Unpublish" : "Publish"}
          >
            {row.published ? (
              <ToggleRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
            aria-label="Edit post"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirmId(row.id)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-red-500 transition-all"
            aria-label="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Blog Posts"
        description="Manage your blog content"
        addNewLabel="New Post"
        onAddNew={openCreateModal}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-1 rounded-xl border border-safariborder bg-safarigray p-1">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-1.5 text-sm capitalize font-medium transition-all ${
                statusFilter === status
                  ? "bg-neon text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <input
            id="blog-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full rounded-xl border border-safariborder bg-safarigray px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon/30 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Query Error */}
      {queryError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          Failed to load blog posts: {queryError.message}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-safarigray border border-safariborder rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-safariborder">
            <div className="flex gap-24">
              {[100, 80, 60, 60, 40].map((w, i) => (
                <div
                  key={i}
                  className="h-3 bg-safariborder rounded"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-4 border-b border-safariborder last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-safariborder animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-safariborder rounded w-48 animate-pulse" />
                  <div className="h-2 bg-safariborder rounded w-32 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      {!isLoading && (
        <DataTable
          data={filteredPosts as any}
          columns={columns as any}
          rowKey="id"
          emptyMessage={
            search || statusFilter !== "all"
              ? "No posts match your filters"
              : "No blog posts yet. Create your first post!"
          }
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={formOpen}
        onClose={closeFormModal}
        title={editingPost ? "Edit Post" : "New Post"}
        size="xl"
      >
        <div className="space-y-5">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" id="post-title" error={!form.title.trim() && createPost.isPending ? "Title is required" : undefined}>
              <input
                id="post-title"
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className={inputClass}
                required
              />
            </FormField>
            <FormField label="Slug" id="post-slug">
              <input
                id="post-slug"
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-title"
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Excerpt */}
          <FormField label="Excerpt" id="post-excerpt">
            <textarea
              id="post-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the post..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </FormField>

          {/* Content */}
          <FormField label="Content" id="post-content">
            <textarea
              id="post-content"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog content here (HTML or Markdown)..."
              rows={10}
              className={`${inputClass} resize-y min-h-[200px] font-mono text-xs`}
            />
          </FormField>

          {/* Featured Image */}
          <FormField label="Featured Image" id="post-featured-image">
            <ImageUploader
              value={form.featuredImage}
              onChange={(url) => setForm((prev) => ({ ...prev, featuredImage: url }))}
            />
          </FormField>

          {/* SEO Fields */}
          <div className="border-t border-safariborder pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              SEO Settings
            </p>
            <div className="space-y-4">
              <FormField label="SEO Title" id="post-seo-title">
                <input
                  id="post-seo-title"
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="Custom title for search engines..."
                  className={inputClass}
                />
              </FormField>
              <FormField label="SEO Description" id="post-seo-desc">
                <textarea
                  id="post-seo-desc"
                  value={form.seoDesc}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoDesc: e.target.value }))}
                  placeholder="Meta description for search engines..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </FormField>
            </div>
          </div>

          {/* Published Toggle */}
          <div className="border-t border-safariborder pt-5">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                role="switch"
                aria-checked={form.published}
                onClick={() => setForm((prev) => ({ ...prev, published: !prev.published }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                  form.published ? "bg-neon" : "bg-safariborder"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    form.published ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <div>
                <p className="text-sm font-medium text-white">
                  {form.published ? "Published" : "Draft"}
                </p>
                <p className="text-xs text-gray-500">
                  {form.published
                    ? "This post will be visible to the public"
                    : "This post will be saved as a draft"}
                </p>
              </div>
            </label>
          </div>

          {/* Save Error */}
          {saveError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
              {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={closeFormModal}
              className="px-5 py-2.5 rounded-xl border border-safariborder text-gray-400 hover:text-white hover:border-white transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !form.title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-safariborder text-gray-400 hover:text-white hover:border-white transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirmId) {
                  deletePost.mutate({ id: deleteConfirmId });
                }
              }}
              disabled={deletePost.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
            >
              {deletePost.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {deletePost.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
          {deletePost.error && (
            <p className="text-xs text-red-500">{deletePost.error.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
