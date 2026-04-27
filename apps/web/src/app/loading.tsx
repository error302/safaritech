export default function Loading() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon border-t-transparent" />
        <p className="text-gray-500 md:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
