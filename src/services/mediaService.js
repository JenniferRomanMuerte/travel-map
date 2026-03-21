import { supabase } from "../lib/supabase";
import { uploadFile, deleteFile } from "./storageService";

export async function saveMedia(placeId, type, url, filePath = null) {
  const { data, error } = await supabase
    .from("media")
    .insert([
      {
        place_id: placeId,
        type,
        url,
        file_path: filePath,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
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

export async function addFilesToPlace(placeId, files) {
  const savedItems = [];

  for (const file of files) {
    const type = file.type.startsWith("video/") ? "video" : "photo";
    const { url, filePath } = await uploadFile(file);
    const savedMedia = await saveMedia(placeId, type, url, filePath);
    savedItems.push(savedMedia);
  }

  return savedItems;
}

export async function removeMediaItem(mediaItem) {
  if (mediaItem.file_path) {
    await deleteFile(mediaItem.file_path);
  }

  const { error } = await supabase
    .from("media")
    .delete()
    .eq("id", mediaItem.id);

  if (error) {
    throw error;
  }
}