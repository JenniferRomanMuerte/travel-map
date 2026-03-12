import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  return (
    <div>

      <h1>{place.city}, {place.country}</h1>

      <h3>{place.visited_at}</h3>

      {place.notes && <p>{place.notes}</p>}

      <h2>Fotos</h2>

      <div>
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.url}
            alt=""
            width="300"
          />
        ))}
      </div>

      <h2>Videos</h2>

      <div>
        {videos.map(video => (
          <video
            key={video.id}
            src={video.url}
            controls
            width="400"
          />
        ))}
      </div>

    </div>
  );

};

export default PlacePage;