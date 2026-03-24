import { supabase } from "../lib/supabase";
import { compressVideo, compressImage } from "../lib/mediaCompressor";
import { uploadMediaFile, deleteMediaFile } from "./mediaStorageService";

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

  for (let file of files) {
    let type = "photo";

    if (file.type.startsWith("video/")) {
      file = await compressVideo(file);
      type = "video";
    } else if (file.type.startsWith("image/")) {
      file = await compressImage(file);
      type = "photo";
    } else {
      throw new Error("Tipo de archivo no soportado");
    }

    const { url, filePath } = await uploadMediaFile(file);
    const savedMedia = await saveMedia(placeId, type, url, filePath);
    savedItems.push(savedMedia);
  }

  return savedItems;
}
export async function removeMediaItem(mediaItem) {
  if (mediaItem.file_path) {
    await deleteMediaFile(mediaItem.file_path);
  }

  const { error } = await supabase
    .from("media")
    .delete()
    .eq("id", mediaItem.id);

  if (error) {
    throw error;
  }
}