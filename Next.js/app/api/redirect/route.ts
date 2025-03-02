import { type NextRequest, NextResponse } from "next/server"
import { incrementClickCount } from "@/lib/actions"

export async function POST(request: NextRequest) {
  try {
    const { shortUrl } = await request.json()

    if (!shortUrl) {
      return NextResponse.json({ success: false, error: "Short URL is required" }, { status: 400 })
    }

    // Increment click count
    const result = await incrementClickCount(shortUrl)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in redirect API:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

