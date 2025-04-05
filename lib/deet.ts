import { DeedData } from "@/types/deed";
import { createServerClient } from "./supabase";

export async function getDeeds() {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("deeds")
      .select("*")
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Error fetching deeds:", error);
      return [];
    }
  
    return data as DeedData[];
  }