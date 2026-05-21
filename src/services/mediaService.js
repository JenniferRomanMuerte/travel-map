import { api } from "../lib/api";
import { compressVideo, compressImage } from "../lib/mediaCompressor";
import { uploadMediaFile, deleteMediaFile } from "./mediaStorageService";

export async function saveMedia(placeId, type, url, filePath = null) {
  return api.post("/media", { place_id: placeId, type, url, file_path: filePath });
}

export async function getMediaByPlace(placeId) {
  try {
    return await api.get(`/media/${placeId}`);
  } catch (err) {
    console.error("Error cargando media:", err);
    return [];
  }
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
  await api.delete(`/media/${mediaItem.id}`);
}
