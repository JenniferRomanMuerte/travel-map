import { createPlace } from "../services/placesService";
import { uploadFile } from "../services/storageService";
import { saveMedia } from "../services/mediaService";
import { compressVideo } from "../services/videoCompressor";
import { getCityCountry } from "../services/geocodingService";
import { supabase } from "../lib/supabase";

export async function saveTravel(data, setUploadProgress) {
  const { visitedAt, notes, files, coords } = data;

  if (!coords?.lat || !coords?.lng) {
    throw new Error("Coordenadas no válidas");
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
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
    user_id: user.id
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

      if (file.type.startsWith("video")) {
        const maxSize = 30 * 1024 * 1024;

        if (file.size > maxSize) {

          file = await compressVideo(file);
        }
      }


      const { url, filePath } = await uploadFile(file);

      const type = file.type.startsWith("video") ? "video" : "photo";

      await saveMedia(place.id, type, url, filePath);

      const progress = 15 + Math.round(((i + 1) / totalFiles) * 85);
      setUploadProgress(progress);
    }
  } else {
    setUploadProgress(100);
  }

  return place;
}