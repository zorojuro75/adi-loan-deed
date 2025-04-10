import { DeedWithRelations } from "@/types/deed";
import { createServerClient, supabase } from "./supabase";

export async function getDeed(id: string): Promise<DeedWithRelations | null> {
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

export async function getDeeds(): Promise<DeedWithRelations[]> {
  const supabase = createServerClient();

  // Step 1: Fetch all deeds
  const { data: deeds, error: deedsError } = await supabase
    .from("deeds")
    .select("*")
    .order("created_at", { ascending: false });

  if (deedsError || !deeds) {
    console.error("Error fetching deeds:", deedsError);
    return [];
  }

  // Step 2: Loop and fetch related data for each deed
  const deedsWithRelations: DeedWithRelations[] = await Promise.all(
    deeds.map(async (deed) => {
      const [checks, nominees, bankDetails, adi] = await Promise.all([
        supabase
          .from("checks")
          .select("*")
          .eq("deed_id", deed.id)
          .then((res) => res.data || []),
        supabase
          .from("nominees")
          .select("*")
          .eq("deed_id", deed.id)
          .then((res) => res.data || []),
        supabase
          .from("interest_bank_details")
          .select("*")
          .eq("deed_id", deed.id)
          .single()
          .then((res) => res.data || {}),
        supabase
          .from("first_side_representative")
          .select("*")
          .eq("deed_id", deed.id)
          .single()
          .then((res) => res.data || {}),
      ]);

      return {
        ...deed,
        checks,
        nominees,
        interest_bank_details: bankDetails,
        first_side_representative: adi,
      };
    })
  );

  return deedsWithRelations;
}

export const generateDeedId = (branch_code: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase
        .from("deeds")
        .select("deed_custom_id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      let sequenceNumber: string;

      if (error || !data) {
        sequenceNumber = "001";
      } else {
        const lastDeedId = data.deed_custom_id;
        const lastThreeDigits = lastDeedId.slice(-4);
        const incremented = parseInt(lastThreeDigits, 10) + 1;
        sequenceNumber = String(incremented).padStart(4, "0");
      }

      const paddedBranchCode = String(branch_code).padStart(3, "0");

      const newDeedId = `${paddedBranchCode}${sequenceNumber}`;
      resolve(newDeedId);
    } catch (err) {
      reject(err);
    }
  });
};
