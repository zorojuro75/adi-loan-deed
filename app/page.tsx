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
      {/* Top Section */}
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-md mb-10">
        <div className="flex items-center space-x-4">
          <Image
            src="/adi.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold text-gray-800">Deed Manager</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/deeds/new">
            <Button
              size="lg"
              className="rounded-xl shadow hover:bg-primary/90 transition"
            >
              + New Deed
            </Button>
          </Link>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm font-medium text-red-600 hover:text-red-800 transition"
            >
              Sign out →
            </button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        {deeds.length === 0 ? (
          <p className="text-center text-gray-500">
            No deeds found. Create a new deed to get started.
          </p>
        ) : (
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Deed No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Loan</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Agreement</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deeds.map((deed, index) => (
                <tr
                  key={deed.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {deed.deed_custom_id}
                  </td>
                  <td className="px-4 py-3">{deed.fullname}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {deed.loan_amount} ৳
                  </td>
                  <td className="px-4 py-3">
                    {deed.first_side_representative.branch_name}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(deed.agreementdate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/deeds/${deed.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Link href={`/deeds/${deed.id}`}>
                        <Button size="sm">Approve</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
