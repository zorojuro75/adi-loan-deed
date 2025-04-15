import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeed } from "@/lib/deet";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import DownloadPdfButton from "@/components/download-pdf-button";

export const revalidate = 0;

export default async function DeedPage({ params }: { params: { id: string } }) {
  const deed = await getDeed(params.id);

  if (!deed) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bangla text-primary">
              {deed.fullname}
            </h1>
            <Badge variant="secondary" className="text-sm">
              Deed ID: {deed.deed_custom_id}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created on {formatDate(deed.created_at || new Date().toISOString())}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/deeds/${deed.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Deed
            </Button>
          </Link>
          <DownloadPdfButton deed={deed} />
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to List
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Column */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Agreement Date
                  </p>
                  <p className="font-medium">
                    {formatDate(deed.agreementdate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="font-medium">
                    {deed.loan_amount.toLocaleString()} BDT
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium bangla">{deed.fullname}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Father&apos;s Name
                  </p>
                  <p className="font-medium bangla">{deed.fathersname}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Mother&apos;s Name
                  </p>
                  <p className="font-medium bangla">{deed.mothersname}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">NID</p>
                  <p className="font-medium">{deed.nid}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{deed.mobile}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Cards */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 bangla">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Current Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Village</p>
                    <p className="font-medium bangla">{deed.currentvillage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Post Office</p>
                    <p className="font-medium bangla">
                      {deed.currentpostoffice}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Upazila</p>
                    <p className="font-medium bangla">{deed.currentupazila}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-medium bangla">{deed.currentdistrict}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 bangla">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Permanent Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Village</p>
                    <p className="font-medium bangla">
                      {deed.permanentvillage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Post Office</p>
                    <p className="font-medium bangla">
                      {deed.permanentpostoffice}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Upazila</p>
                    <p className="font-medium bangla">
                      {deed.permanentupazila}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-medium bangla">
                      {deed.permanentdistrict}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Information Column */}
        <div className="space-y-6">
          {/* Loan Details */}
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount in Words</p>
                <p className="font-medium">{deed.loan_amount_in_words}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tenure</p>
                <p className="font-medium">{deed.tenure_of_loan} months</p>
              </div>
            </CardContent>
          </Card>

          {/* Checks */}
          {deed.checks && deed.checks.length > 0 && (
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Bank Checks ({deed.checks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {deed.checks.map((check) => (
                  <div
                    key={check.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Check No.
                        </p>
                        <p className="font-medium">{check.check_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {check.amount.toLocaleString()} BDT
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bank</p>
                        <p className="font-medium bangla">{check.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Branch</p>
                        <p className="font-medium bangla">{check.branch}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Interest Bank Details */}
          {deed.interest_bank_details && (
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M6 12h.01M18 12h.01"></path>
                  </svg>
                  Interest Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Name
                    </p>
                    <p className="font-medium">
                      {deed.interest_bank_details.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account No.</p>
                    <p className="font-medium">
                      {deed.interest_bank_details.account_number}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p className="font-medium">
                      {deed.interest_bank_details.bank_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">
                      {deed.interest_bank_details.branch}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Routing No.</p>
                    <p className="font-medium">
                      {deed.interest_bank_details.branch_routing_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {deed.interest_bank_details.amount.toLocaleString()} BDT
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* People Column */}
        <div className="space-y-6">
          {/* Representative */}
          {deed.first_side_representative && (
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Company Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {deed.first_side_representative.name}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">
                      {deed.first_side_representative.branch_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">
                      {deed.first_side_representative.region_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">
                      {deed.first_side_representative.zone_name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nominees */}
          {deed.nominees && deed.nominees.length > 0 && (
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Nominees ({deed.nominees.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {deed.nominees.map((nominee) => (
                  <div
                    key={nominee.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium bangla">{nominee.name}</p>
                        <p className="text-sm text-muted-foreground bangla">
                          {nominee.relationship}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {nominee.distributed_portion}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Father&apos;s Name
                        </p>
                        <p className="text-sm bangla">{nominee.fathersname}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="text-sm">{nominee.age}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">NID</p>
                        <p className="text-sm">{nominee.nid}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p className="text-sm">{nominee.mobile}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Witnesses */}
          <div className="space-y-6">
            {deed.witnesses_adi && deed.witnesses_adi.length > 0 && (
              <Card>
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Adi Witnesses ({deed.witnesses_adi.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {deed.witnesses_adi.map((witness) => (
                    <div
                      key={witness.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium">{witness.name}</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Father&apos;s Name
                          </p>
                          <p className="text-sm">{witness.fathersname}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="text-sm">{witness.age}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="text-sm">{witness.addresss}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">NID</p>
                          <p className="text-sm">{witness.nid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Mobile
                          </p>
                          <p className="text-sm">{witness.mobile}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {deed.witnesses_lander && deed.witnesses_lander.length > 0 && (
              <Card>
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Lander Witnesses ({deed.witnesses_lander.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {deed.witnesses_lander.map((witness) => (
                    <div
                      key={witness.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium">{witness.name}</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Father&apos;s Name
                          </p>
                          <p className="text-sm">{witness.fathersname}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="text-sm">{witness.age}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="text-sm">{witness.addresss}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">NID</p>
                          <p className="text-sm">{witness.nid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Mobile
                          </p>
                          <p className="text-sm">{witness.mobile}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
