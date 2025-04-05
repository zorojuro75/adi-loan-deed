import React from "react";
import NewDeedPage from "./from";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default async function page() {
  const user = await getCurrentUser();

  if (!user) {
    // Handle case where user is not authenticated
    return <div>Please sign in to access this page</div>;
  }

  // Fetch branch data from Supabase
  const { data: branchData, error } = await supabase
    .from("branches") // Replace with your actual table name
    .select(
      `
      *,
      region:regions (
        *,
        zone:zones (*)
      )
    `
    )
    .eq("branch_code", user.branch_code)
    .single();

  if (error) {
    console.error("Error fetching branch data:", error);
    // Handle error appropriately
    return <div>Error loading branch information</div>;
  }

  console.log("Branch data:", branchData);
  return (
    <div>
      <NewDeedPage branchData={branchData}/>
    </div>
  );
}
