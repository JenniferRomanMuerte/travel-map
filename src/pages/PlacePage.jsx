import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TravelDomeGallery from "../components/DomeGallery/TravelDomeGallery";
import CircularVideoGallery from "../components/CircularVideoGallery/CircularVideoGallery";
import TravelLoader from "../components/TravelLoader";
import { getPlaceById } from "../services/placesService";
import { getMediaByPlace } from "../services/mediaService";

const PlacePage = () => {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosReady, setPhotosReady] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
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
        setPhotosReady(false);
        setVideosReady(false);

        const [placeData, mediaData] = await Promise.all([
          getPlaceById(id),
          getMediaByPlace(id),
        ]);

        setPlace(placeData);
        setMedia(mediaData);

        const hasPhotos = mediaData.some((item) => item.type === "photo");
        const hasVideos = mediaData.some((item) => item.type === "video");

        if (!hasPhotos) setPhotosReady(true);
        if (!hasVideos) setVideosReady(true);
      } catch (err) {
        console.error("Error cargando lugar:", err);
        setError("No se pudo cargar el viaje");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const photos = media.filter((item) => item.type === "photo");
  const videos = media.filter((item) => item.type === "video");

  const showLoader =
    loading ||
    (photos.length > 0 && !photosReady) ||
    (videos.length > 0 && !videosReady);

  if (!loading && error) {
    return (
      <div className="travel-page">
        <p>{error}</p>
        <Link to="/">← Volver al mapa</Link>
      </div>
    );
  }

  if (!loading && !place) {
    return (
      <div className="travel-page">
        <p>No se encontró el viaje</p>
        <Link to="/">← Volver al mapa</Link>
      </div>
    );
  }

  const formattedDate = place?.visited_at
    ? new Date(place.visited_at).toLocaleDateString("es-ES")
    : "Fecha no especificada";

  return (
    <div className="travel-page">
      {showLoader && <TravelLoader text="Viajando..." />}

      {place && (
        <div
          className="travel-page__container"
          style={{
            opacity: showLoader ? 0 : 1,
            visibility: showLoader ? "hidden" : "visible",
            pointerEvents: showLoader ? "none" : "auto",
          }}
        >
          <header className="travel-page__header">
            <h1 className="travel-page__title">
              {place.city}, {place.country}
            </h1>

            <div className="travel-page__info">
              <p className="travel-page__info-date">{formattedDate}</p>
              <Link to="/" className="travel-page__info-back">
                ← Volver al mapa
              </Link>
            </div>

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
                onReady={() => setPhotosReady(true)}
              />
            )}
          </section>

          <section className="travel-page__section">
            <h2 className="travel-page__section-title">Vídeos</h2>

            {videos.length === 0 ? (
              <p className="travel-page__empty">No hay vídeos</p>
            ) : (
              <CircularVideoGallery
                videos={videos.map((video) => ({
                  id: video.id,
                  url: video.url,
                  title: `${place.city}, ${place.country}`,
                }))}
                onReady={() => setVideosReady(true)}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default PlacePage;