import { supabase } from "../lib/supabase";

export async function saveMedia(placeId, type, url) {
  const { error } = await supabase
    .from("media")
    .insert([
      {
        place_id: placeId,
        type,
        url
      }
    ]);

  if (error) {
    throw error;
  }
}

export async function getMediaByPlace(placeId) {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("place_id", placeId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error cargando media:", error);
    return [];
  }

  return data ?? [];
}