"use client"

import { useSearchParams } from "next/navigation"
import { RedirectTracker } from "@/components/redirect-tracker"

export default function RedirectPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")

  if (!url) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid URL</h1>
          <p className="text-gray-500">The URL you are trying to access is invalid.</p>
        </div>
      </div>
    )
  }

  return <RedirectTracker shortUrl={url} />
}

