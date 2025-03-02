"use client"

import { useEffect } from "react"

interface RedirectTrackerProps {
  shortUrl: string
}

export function RedirectTracker({ shortUrl }: RedirectTrackerProps) {
  useEffect(() => {
    const trackRedirect = async () => {
      try {
        await fetch("/api/redirect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shortUrl }),
        })
      } catch (error) {
        console.error("Error tracking redirect:", error)
      }
    }

    // Track the redirect
    trackRedirect()

    // Redirect to the original URL
    window.location.href = shortUrl
  }, [shortUrl])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-gray-500">You are being redirected to: {shortUrl}</p>
      </div>
    </div>
  )
}

