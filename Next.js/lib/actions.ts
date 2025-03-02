"use server"

import { nanoid } from "nanoid"
import fs from "fs/promises"
import path from "path"

// Type definitions
interface UrlMapping {
  originalUrl: string
  shortUrl: string
  clicks: number
  createdAt: string
}

interface UrlDatabase {
  urls: Record<string, UrlMapping>
}

// In-memory database
let urlDatabase: UrlDatabase = { urls: {} }
const DB_PATH = path.join(process.cwd(), "data", "urls.json")

// Initialize database
async function initDatabase() {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true })

    // Try to read existing database
    const data = await fs.readFile(DB_PATH, "utf-8")
    urlDatabase = JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is invalid, create a new database
    await saveDatabase()
  }
}

// Save database to file
async function saveDatabase() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(urlDatabase, null, 2))
  } catch (error) {
    console.error("Error saving database:", error)
  }
}

// Generate a short code
function generateShortCode(length = 6) {
  return nanoid(length)
}

// Get base URL for the application
function getBaseUrl() {
  // In production, use the deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // In development, use localhost
  return "http://localhost:3000"
}

// Track URL in our system
export async function trackUrl(originalUrl: string, shortUrl: string) {
  try {
    // Initialize database if needed
    await initDatabase()

    // Generate a unique key for the URL
    const urlKey = Buffer.from(shortUrl).toString("base64")

    // Add to database if it doesn't exist
    if (!urlDatabase.urls[urlKey]) {
      urlDatabase.urls[urlKey] = {
        originalUrl,
        shortUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
      }

      // Save to file
      await saveDatabase()
    }

    return { success: true }
  } catch (error) {
    console.error("Error tracking URL:", error)
    return { success: false, error: "Failed to track URL" }
  }
}

// Increment click count for a URL
export async function incrementClickCount(shortUrl: string) {
  try {
    // Initialize database if needed
    await initDatabase()

    // Generate the key for the URL
    const urlKey = Buffer.from(shortUrl).toString("base64")

    // Check if URL exists in our database
    if (urlDatabase.urls[urlKey]) {
      // Increment click count
      urlDatabase.urls[urlKey].clicks++

      // Save to file
      await saveDatabase()

      return {
        success: true,
        originalUrl: urlDatabase.urls[urlKey].originalUrl,
        clicks: urlDatabase.urls[urlKey].clicks,
      }
    }

    return { success: false, error: "URL not found in tracking system" }
  } catch (error) {
    console.error("Error incrementing click count:", error)
    return { success: false, error: "Failed to update click count" }
  }
}

// Shorten URL action
export async function shortenUrl(originalUrl: string) {
  try {
    // Initialize database if needed
    await initDatabase()

    // Validate URL
    try {
      new URL(originalUrl)
    } catch (error) {
      return { success: false, error: "Invalid URL format" }
    }

    // Check if URL already exists in database
    const existingEntry = Object.values(urlDatabase.urls).find((entry) => entry.originalUrl === originalUrl)

    if (existingEntry) {
      const shortUrl = `${getBaseUrl()}/s/${existingEntry.shortCode}`
      return { success: true, shortUrl }
    }

    // Generate a new short code
    const shortCode = generateShortCode()

    // Add to database
    const shortUrl = `${getBaseUrl()}/s/${shortCode}`

    // Track the URL
    const trackResult = await trackUrl(originalUrl, shortUrl)
    if (!trackResult.success) {
      return { success: false, error: trackResult.error }
    }

    // Return the short URL
    return { success: true, shortUrl }
  } catch (error) {
    console.error("Error shortening URL:", error)
    return { success: false, error: "Failed to shorten URL" }
  }
}

// Get URL mapping
export async function getUrlMapping(shortCode: string) {
  try {
    // Initialize database if needed
    await initDatabase()

    // Construct the short URL
    const shortUrl = `${getBaseUrl()}/s/${shortCode}`

    // Increment the click count
    const incrementResult = await incrementClickCount(shortUrl)

    if (!incrementResult.success) {
      return { success: false, error: incrementResult.error }
    }

    // Return the original URL and clicks
    return {
      success: true,
      originalUrl: incrementResult.originalUrl,
      clicks: incrementResult.clicks,
    }
  } catch (error) {
    console.error("Error getting URL mapping:", error)
    return { success: false, error: "Failed to retrieve URL" }
  }
}

// Get all URLs with stats
export async function getAllUrls() {
  try {
    // Initialize database if needed
    await initDatabase()

    // Return all URLs
    return {
      success: true,
      urls: Object.values(urlDatabase.urls).map((entry) => ({
        originalUrl: entry.originalUrl,
        shortUrl: entry.shortUrl,
        clicks: entry.clicks,
        createdAt: entry.createdAt,
      })),
    }
  } catch (error) {
    console.error("Error getting all URLs:", error)
    return { success: false, error: "Failed to retrieve URLs" }
  }
}

