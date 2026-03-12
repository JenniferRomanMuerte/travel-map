import { createPlace } from "../services/placesService";
import { uploadFile } from "../services/storageService";
import { saveMedia } from "../services/mediaService";
import { compressVideo } from "../services/videoCompressor";
import { getCityCountry } from "../services/geocodingService";

export async function saveTravel(data, setProcessModal) {

  const { visitedAt, notes, files, coords } = data;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuario no autenticado");


  setProcessModal({
    isOpen: true,
    message: "Guardando viaje...",
    type: "loading"
  });

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

  if (!place) throw new Error("Place no creado");

  if (files && files.length > 0) {

    const filesArray = Array.from(files);

    for (let i = 0; i < filesArray.length; i++) {

      let file = filesArray[i];

      if (file.type.startsWith("video")) {

        const maxSize = 30 * 1024 * 1024;

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
        message: `Subiendo archivo ${i + 1} de ${filesArray.length}...`,
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