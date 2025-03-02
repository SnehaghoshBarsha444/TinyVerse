import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllUrls } from "@/lib/actions"
import { formatDistanceToNow } from "date-fns"

export default async function StatsPage() {
  const { success, urls = [], error } = await getAllUrls()

  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>URL Statistics</CardTitle>
          <CardDescription>View all shortened URLs and their click statistics</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <p className="text-red-500">{error || "Failed to load statistics"}</p>
          ) : urls.length === 0 ? (
            <p className="text-center py-4">No URLs have been shortened yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium truncate max-w-[200px]">
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {url.originalUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {url.shortUrl}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">{url.clicks}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(url.createdAt), { addSuffix: true })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

