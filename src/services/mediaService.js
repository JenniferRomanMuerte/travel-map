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

  if (error) throw error;
}