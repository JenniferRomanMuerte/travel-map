import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlaceById } from "../services/placesService";
import { getMediaByPlace } from "../services/mediaService";

const PlacePage = () => {

  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [media, setMedia] = useState([]);

  useEffect(() => {

    async function loadData() {

      const placeData = await getPlaceById(id);
      const mediaData = await getMediaByPlace(id);

      setPlace(placeData);
      setMedia(mediaData);

    }

    loadData();

  }, [id]);

  if (!place) return <p>Cargando...</p>;

  const photos = media.filter(m => m.type === "photo");
  const videos = media.filter(m => m.type === "video");

  const formattedDate = place.visited_at
    ? new Date(place.visited_at).toLocaleDateString()
    : "Fecha no especificada";

  return (
    <div>

      <h1>{place.city}, {place.country}</h1>

      <h3>{formattedDate}</h3>

      {place.notes && <p>{place.notes}</p>}
      <Link to="/">← Volver al mapa</Link>
      <h2>Fotos</h2>

      {photos.length === 0 && <p>No hay fotos</p>}

      <div>
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.url}
            loading="lazy"
            alt=""
            width="300"
          />
        ))}
      </div>

      <h2>Videos</h2>

      {videos.length === 0 && <p>No hay videos</p>}

      <div>
        {videos.map(video => (
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