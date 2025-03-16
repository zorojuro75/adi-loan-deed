import { createServerClient } from "@/lib/supabase"
import { DeedData } from "@/types/deed"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

export const revalidate = 0

async function getDeeds() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("deeds").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching deeds:", error)
    return []
  }

  return data as DeedData[]
}

export default async function Home() {
  const deeds = await getDeeds()

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Deed PDF Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deeds.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No deeds found. Create a new deed to get started.
          </p>
        ) : (
          deeds.map((deed) => (
            <Card key={deed.id} className="h-full">
              <CardHeader>
                <CardTitle className="bangla">{deed.fullname}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Agreement Date:</span> {formatDate(deed.agreementdate)}
                  </p>
                  <p>
                    <span className="font-medium">NID:</span> {deed.nid}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span> {deed.mobile}
                  </p>
                  <div className="mt-4">
                    <Link href={`/deeds/${deed.id}`}>
                      <Button>View Deed</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/deeds/new">
          <Button size="lg">Create New Deed</Button>
        </Link>
      </div>
    </main>
  )
}

