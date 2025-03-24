import { createServerClient } from "@/lib/supabase";
import type { DeedWithRelations } from "@/types/deed";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import DeedPdfPreview from "@/components/deed-pdf-preview";

export const revalidate = 0;

async function getDeed(id: string): Promise<DeedWithRelations | null> {
  const supabase = createServerClient();

  // Get the deed
  const { data: deed, error: deedError } = await supabase
    .from("deeds")
    .select("*")
    .eq("id", id)
    .single();

  if (deedError || !deed) {
    console.error("Error fetching deed:", deedError);
    return null;
  }

  // Get the checks
  const { data: checks, error: checksError } = await supabase
    .from("checks")
    .select("*")
    .eq("deed_id", id);

  if (checksError) {
    console.error("Error fetching checks:", checksError);
  }

  // Get the nominees
  const { data: nominees, error: nomineesError } = await supabase
    .from("nominees")
    .select("*")
    .eq("deed_id", id);

  if (nomineesError) {
    console.error("Error fetching nominees:", nomineesError);
  }

  // Get the bank details
  const { data: bankDetails, error: bankDetailsError } = await supabase
    .from("interest_bank_details")
    .select("*")
    .eq("deed_id", id)
    .single();
  if (bankDetailsError) {
    console.error("Error fetching bank details:", bankDetailsError);
  }
  // Get the ADI
  const { data: adi, error: adiError } = await supabase
    .from("first_side_representative")
    .select("*")
    .eq("deed_id", id)
    .single();
  if (adiError) {
    console.error("Error fetching ADI:", adiError);
  }

  return {
    ...deed,
    checks: checks || [],
    nominees: nominees || [],
    interest_bank_details: bankDetails || {},
    first_side_representative: adi || {},
  };
}

export default async function DeedPage({ params }: { params: { id: string } }) {
  const deed = await getDeed(params.id);

  if (!deed) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bangla">{deed.fullname} - Deed</h1>
        <div className="flex gap-4">
          <Link href={`/deeds/${deed.id}/edit`}>
            <Button variant="outline">Edit Deed</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Deed Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Agreement Date:</span>{" "}
                  {formatDate(deed.agreementdate)}
                </p>
                <p>
                  <span className="font-medium bangla">Full Name:</span>{" "}
                  <span className="bangla">{deed.fullname}</span>
                </p>
                <p>
                  <span className="font-medium bangla">
                    Father&apos;s Name:
                  </span>{" "}
                  <span className="bangla">{deed.fathersname}</span>
                </p>
                <p>
                  <span className="font-medium bangla">
                    Mother&apos;s Name:
                  </span>{" "}
                  <span className="bangla">{deed.mothersname}</span>
                </p>
                <p>
                  <span className="font-medium">NID:</span> {deed.nid}
                </p>
                <p>
                  <span className="font-medium">Mobile:</span> {deed.mobile}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 bangla">
                Current Address
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium bangla">Village:</span>{" "}
                  <span className="bangla">{deed.currentvillage}</span>
                </p>
                <p>
                  <span className="font-medium bangla">Post Office:</span>{" "}
                  <span className="bangla">{deed.currentpostoffice}</span>
                </p>
                <p>
                  <span className="font-medium bangla">Upazila:</span>{" "}
                  <span className="bangla">{deed.currentupazila}</span>
                </p>
                <p>
                  <span className="font-medium bangla">District:</span>{" "}
                  <span className="bangla">{deed.currentdistrict}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 bangla">
                Permanent Address
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium bangla">Village:</span>{" "}
                  <span className="bangla">{deed.permanentvillage}</span>
                </p>
                <p>
                  <span className="font-medium bangla">Post Office:</span>{" "}
                  <span className="bangla">{deed.permanentpostoffice}</span>
                </p>
                <p>
                  <span className="font-medium bangla">Upazila:</span>{" "}
                  <span className="bangla">{deed.permanentupazila}</span>
                </p>
                <p>
                  <span className="font-medium bangla">District:</span>{" "}
                  <span className="bangla">{deed.permanentdistrict}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {deed.checks && deed.checks.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Checks</h2>
                <div className="space-y-4">
                  {deed.checks.map((check) => (
                    <div key={check.id} className="p-3 border rounded-md">
                      <p>
                        <span className="font-medium">Check Number:</span>{" "}
                        {check.check_number}
                      </p>
                      <p>
                        <span className="font-medium bangla">Bank:</span>{" "}
                        <span className="bangla">{check.bank_name}</span>
                      </p>
                      <p>
                        <span className="font-medium bangla">Branch:</span>{" "}
                        <span className="bangla">{check.branch}</span>
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span>{" "}
                        {check.amount.toLocaleString()} BDT
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {deed.nominees && deed.nominees.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 bangla">Nominees</h2>
                <div className="space-y-4">
                  {deed.nominees.map((nominee) => (
                    <div key={nominee.id} className="p-3 border rounded-md">
                      <p>
                        <span className="font-medium bangla">Name:</span>{" "}
                        <span className="bangla">{nominee.name}</span>
                      </p>
                      <p>
                        <span className="font-medium bangla">
                          Father&apos;s Name:
                        </span>{" "}
                        <span className="bangla">{nominee.fathersname}</span>
                      </p>
                      <p>
                        <span className="font-medium">Age:</span> {nominee.age}
                      </p>
                      <p>
                        <span className="font-medium">NID:</span> {nominee.nid}
                      </p>
                      <p>
                        <span className="font-medium">Mobile:</span>{" "}
                        {nominee.mobile}
                      </p>
                      <p>
                        <span className="font-medium bangla">
                          Relationship:
                        </span>{" "}
                        <span className="bangla">{nominee.relationship}</span>
                      </p>
                      <p>
                        <span className="font-medium">
                          Distributed Portion:
                        </span>{" "}
                        {nominee.distributed_portion}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full min-w-[960px]">
            <CardContent className="pt-6 h-full">
              <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
              <DeedPdfPreview deed={deed} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
