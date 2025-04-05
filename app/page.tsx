import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getDeeds } from "@/lib/deet";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  const deeds = await getDeeds();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <Image src={"/adi.png"} height={100} width={100} alt="" />
        <div className="flex items-center gap-10">
          <div className="text-center">
            <Link href="/deeds/new">
              <Button size="lg">Create New Deed</Button>
            </Link>
          </div>
          <div className="text-center">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
              >
                Sign out
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {deeds.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No deeds found. Create a new deed to get started.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 scro">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial No
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deed No
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agreement Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount of Loan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenure of Loan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date of Tenure
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Interest
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount of Interest
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  A/C No of Interest
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name of Bank
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name of Branch
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Routing No of Bank
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  view Deed
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deeds.map((deed, index) => (
                <tr key={index} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.deed_custom_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.fullname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(deed.agreementdate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.loan_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.tenure_of_loan} year
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(
                      new Date(
                        new Date(deed.agreementdate).setFullYear(
                          new Date(deed.agreementdate).getFullYear() +
                            deed.tenure_of_loan
                        )
                      ).toISOString()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {" "}
                    {new Date(deed.agreementdate)
                      .getDate()
                      .toString()
                      .padStart(2, "0")}{" "}
                    of each month
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.loan_amount * 0.01}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.interest_bank_details.account_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.interest_bank_details.bank_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.interest_bank_details.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deed.interest_bank_details.branch_routing_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/deeds/${deed.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/deeds/${deed.id}`}>
                      <Button size="sm">Approve</Button>
                    </Link>
                  </td>
                </tr>
              ))}{" "}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
