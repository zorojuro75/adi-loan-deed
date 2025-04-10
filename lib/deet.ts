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

  const [checks, nominees, bankDetails, adi, witnesses] = await Promise.all([
    supabase.from("checks").select("*").eq("deed_id", id),
    supabase.from("nominees").select("*").eq("deed_id", id),
    supabase
      .from("interest_bank_details")
      .select("*")
      .eq("deed_id", id)
      .single(),
    supabase
      .from("first_side_representative")
      .select("*")
      .eq("deed_id", id)
      .single(),
    supabase.from("witnesses").select("*").eq("deed_id", id),
  ]);

  if (checks.error) console.error("Error fetching checks:", checks.error);
  if (nominees.error) console.error("Error fetching nominees:", nominees.error);
  if (bankDetails.error)
    console.error("Error fetching bank details:", bankDetails.error);
  if (adi.error) console.error("Error fetching ADI:", adi.error);
  if (witnesses.error)
    console.error("Error fetching witnesses:", witnesses.error);

  return {
    ...deed,
    checks: checks.data || [],
    nominees: nominees.data || [],
    interest_bank_details: bankDetails.data || {},
    first_side_representative: adi.data || {},
    witnesses: witnesses.data || [],
    witnesses_adi: (witnesses.data || []).filter((w) => w.party === "adi"),
    witnesses_lander: (witnesses.data || []).filter(
      (w) => w.party === "lander"
    ),
  };
}

export async function getDeeds(): Promise<DeedWithRelations[]> {
  const supabase = createServerClient();

  const { data: deeds, error: deedsError } = await supabase
    .from("deeds")
    .select("*")
    .order("created_at", { ascending: false });

  if (deedsError || !deeds) {
    console.error("Error fetching deeds:", deedsError);
    return [];
  }

  const deedsWithRelations: DeedWithRelations[] = await Promise.all(
    deeds.map(async (deed) => {
      const [checks, nominees, bankDetails, adi, witnesses] = await Promise.all(
        [
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
          supabase
            .from("witnesses")
            .select("*")
            .eq("deed_id", deed.id)
            .then((res) => res.data || []),
        ]
      );

      return {
        ...deed,
        checks,
        nominees,
        interest_bank_details: bankDetails,
        first_side_representative: adi,
        witnesses,
        witnesses_adi: witnesses.filter((w) => w.party === "adi"),
        witnesses_lander: witnesses.filter((w) => w.party === "lander"),
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
