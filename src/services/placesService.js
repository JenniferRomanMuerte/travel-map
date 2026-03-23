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

export async function updatePlace(placeId, updates) {
  const { data, error } = await supabase
    .from("places")
    .update(updates)
    .eq("id", placeId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePlace(placeId) {
  const { data: mediaItems, error: mediaError } = await supabase
    .from("media")
    .select("id, file_path")
    .eq("place_id", placeId);

  if (mediaError) {
    throw mediaError;
  }

  const filePaths = (mediaItems || [])
    .map((item) => item.file_path)
    .filter(Boolean);

  if (filePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("travel-media")
      .remove(filePaths);

    if (storageError) {
      throw storageError;
    }
  }

  const { error: deleteError } = await supabase
    .from("places")
    .delete()
    .eq("id", placeId);

  if (deleteError) {
    throw deleteError;
  }

  return true;
}