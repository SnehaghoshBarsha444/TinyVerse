"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { trackUrl } from "@/lib/actions"

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copyText, setCopyText] = useState("Copy")

  // Function to shorten URL using TinyURL API
  async function shortenUrlWithTinyUrl(url: string) {
    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error("Failed to shorten URL")
      const data = await response.text()
      return data
    } catch (error) {
      console.error("Error:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = originalUrl.trim()
    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // Use TinyURL API to shorten the URL
      const shortened = await shortenUrlWithTinyUrl(url)

      if (shortened) {
        setShortUrl(shortened)
        // Track the URL in our system
        await trackUrl(url, shortened)
      } else {
        setError("Failed to shorten URL. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shortUrl) {
      setError("No URL to copy")
      return
    }

    try {
      await navigator.clipboard.writeText(shortUrl)
      // Visual feedback
      setCopyText("Copied!")
      setTimeout(() => {
        setCopyText("Copy")
      }, 1500)
    } catch (err) {
      setError("Failed to copy URL")
    }
  }

  const openUrl = () => {
    if (!shortUrl) {
      setError("No URL to open")
      return
    }
    window.open(shortUrl, "_blank")
  }

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.activeElement === document.getElementById("urlInput")) {
        e.preventDefault()
        document.getElementById("shortenBtn")?.click()
      }
    }

    document.addEventListener("keypress", handleKeyPress)
    return () => {
      document.removeEventListener("keypress", handleKeyPress)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">URL Shortener</CardTitle>
          <CardDescription>Shorten your long URLs into compact, easy-to-share links</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="urlInput"
                type="url"
                placeholder="Enter your long URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button id="shortenBtn" type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>

            {shortUrl && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Input id="shortUrl" value={shortUrl} readOnly className="flex-1" />
                  <Button
                    id="copyBtn"
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">{copyText}</span>
                  </Button>
                  <Button
                    id="openBtn"
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={openUrl}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

