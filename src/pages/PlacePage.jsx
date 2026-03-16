import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlaceById } from "../services/placesService";
import { getMediaByPlace } from "../services/mediaService";

const PlacePage = () => {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError("Lugar no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [placeData, mediaData] = await Promise.all([
          getPlaceById(id),
          getMediaByPlace(id)
        ]);

        setPlace(placeData);
        setMedia(mediaData);
      } catch (err) {
        console.error("Error cargando lugar:", err);
        setError("No se pudo cargar el viaje");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/">← Volver al mapa</Link>
      </div>
    );
  }

  if (!place) {
    return (
      <div>
        <p>No se encontró el viaje</p>
        <Link to="/">← Volver al mapa</Link>
      </div>
    );
  }

  const photos = media.filter((item) => item.type === "photo");
  const videos = media.filter((item) => item.type === "video");

  const formattedDate = place.visited_at
    ? new Date(place.visited_at).toLocaleDateString("es-ES")
    : "Fecha no especificada";

  return (
    <div>
      <h1>
        {place.city}, {place.country}
      </h1>

      <h3>{formattedDate}</h3>

      {place.notes && <p>{place.notes}</p>}

      <Link to="/">← Volver al mapa</Link>

      <h2>Fotos</h2>

      {photos.length === 0 && <p>No hay fotos</p>}

      <div>
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            loading="lazy"
            alt={`Foto de ${place.city || "viaje"}`}
            width="300"
          />
        ))}
      </div>

      <h2>Vídeos</h2>

      {videos.length === 0 && <p>No hay vídeos</p>}

      <div>
        {videos.map((video) => (
          <video
            key={video.id}
            src={video.url}
            controls
            preload="metadata"
            width="400"
          />
        ))}
      </div>
    </div>
  );
};

export default PlacePage;