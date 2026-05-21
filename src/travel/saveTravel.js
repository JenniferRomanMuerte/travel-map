import { createPlace } from "../services/placesService";
import { saveMedia } from "../services/mediaService";
import { compressVideo, compressImage } from "../lib/mediaCompressor";
import { getCityCountry } from "../services/geocodingService";
import { uploadMediaFile } from "../services/mediaStorageService";
import { getCurrentUser } from "../services/authService";

export async function saveTravel(data, setUploadProgress) {
  const { visitedAt, notes, files, coords } = data;

  if (!coords?.lat || !coords?.lng) {
    throw new Error("Coordenadas no válidas");
  }

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  setUploadProgress(5);

  let city = "Lugar desconocido";
  let country = "Desconocido";

  try {
    const result = await getCityCountry(coords.lng, coords.lat);
    city = result.city;
    country = result.country;
  } catch (error) {
    console.warn("Geocoding falló:", error);
  }

  const place = await createPlace({
    lat: coords.lat,
    lng: coords.lng,
    city,
    country,
    visited_at: visitedAt || null,
    notes,
    user_id: user.id,
  });

  if (!place) {
    throw new Error("Place no creado");
  }

  setUploadProgress(15);

  if (files && files.length > 0) {
    const filesArray = Array.from(files);
    const totalFiles = filesArray.length;

    for (let i = 0; i < filesArray.length; i++) {
      let file = filesArray[i];
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

      const result = await uploadMediaFile(file);
      await saveMedia(place.id, type, result.url, result.filePath);

      const progress = 15 + Math.round(((i + 1) / totalFiles) * 85);
      setUploadProgress(progress);
    }
  } else {
    setUploadProgress(100);
  }

  return place;
}
