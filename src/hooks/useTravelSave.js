import { createPlace } from "../services/placesService";
import { uploadFile } from "../services/storageService";
import { saveMedia } from "../services/mediaService";
import { compressVideo } from "../services/videoCompressor";
import { getCityCountry } from "../services/geocodingService";

export async function saveTravel(data, setProcessModal) {

  const { visitedAt, notes, files, coords } = data;

  setProcessModal({
    isOpen: true,
    message: "Guardando viaje...",
    type: "loading"
  });

  const { city, country } = await getCityCountry(coords.lng, coords.lat);

  const place = await createPlace({
    lat: coords.lat,
    lng: coords.lng,
    city,
    country,
    visited_at: visitedAt || null,
    notes
  });

  if (!place) throw new Error("Place no creado");

  if (files && files.length > 0) {

    const filesArray = Array.from(files);

    for (let file of filesArray) {

      if (file.type.startsWith("video")) {

        const maxSize = 30 * 1024 * 1024; // 30MB

        if (file.size > maxSize) {

          setProcessModal({
            isOpen: true,
            message: "Comprimiendo vídeo...",
            type: "loading"
          });

          file = await compressVideo(file);

        }

      }

      setProcessModal({
        isOpen: true,
        message: "Subiendo archivos...",
        type: "loading"
      });

      const url = await uploadFile(file);

      const type = file.type.startsWith("video")
        ? "video"
        : "photo";

      await saveMedia(place.id, type, url);

    }

  }

  return place;

}