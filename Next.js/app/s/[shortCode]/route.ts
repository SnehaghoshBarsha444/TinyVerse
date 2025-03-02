import { type NextRequest, NextResponse } from "next/server"
import { getUrlMapping } from "@/lib/actions"

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
  const shortCode = params.shortCode

  // Get URL mapping
  const result = await getUrlMapping(shortCode)

  if (!result.success) {
    // Return 404 if URL not found
    return new NextResponse("URL not found", { status: 404 })
  }

  // Redirect to original URL
  return NextResponse.redirect(result.originalUrl)
}

