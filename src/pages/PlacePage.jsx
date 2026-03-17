import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TravelDomeGallery from "../components/DomeGallery/TravelDomeGallery";
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
    <div className="travel-page">
      <div className="travel-page__container">
        <Link to="/" className="travel-page__back">
          ← Volver al mapa
        </Link>

        <header className="travel-page__header">
          <h1 className="travel-page__title">
            {place.city}, {place.country}
          </h1>

          <p className="travel-page__date">{formattedDate}</p>

          {place.notes && (
            <div className="travel-page__notes">
              <h2 className="travel-page__notes-title">Notas</h2>
              <p className="travel-page__notes-text">{place.notes}</p>
            </div>
          )}
        </header>

        <section className="travel-page__section">
          <h2 className="travel-page__section-title">Fotos</h2>

          {photos.length === 0 ? (
            <p className="travel-page__empty">No hay fotos</p>
          ) : (
            <TravelDomeGallery
              photos={photos}
              placeName={place.city || "viaje"}
            />
          )}
        </section>

        <section className="travel-page__section">
          <h2 className="travel-page__section-title">Vídeos</h2>

          {videos.length === 0 ? (
            <p className="travel-page__empty">No hay vídeos</p>
          ) : (
            <div className="travel-page__videos">
              {videos.map((video) => (
                <video
                  className="travel-page__video"
                  key={video.id}
                  src={video.url}
                  controls
                  preload="metadata"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PlacePage;