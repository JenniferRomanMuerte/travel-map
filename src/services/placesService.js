import { supabase } from "../lib/supabase";

export async function createPlace(data) {
  const { data: place, error } = await supabase
    .from("places")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creando lugar:", error);
    throw error;
  }

  return place;
}

export async function getPlaces(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error leyendo lugares:", error);
    return [];
  }

  return data ?? [];
}

export async function getPlaceById(id) {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}