import DomeGallery from "./DomeGallery";
import { useEffect } from "react";

const TravelDomeGallery = ({ photos, placeName = "viaje", onReady }) => {
  const images = photos.map((photo) => ({
    src: photo.url,
    alt: `Foto de ${placeName}`,
  }));

  useEffect(() => {
    if (!photos || photos.length === 0) {
      if (onReady) onReady();
      return;
    }

    let loadedCount = 0;

    photos.forEach((photo) => {
      const img = new Image();
      img.src = photo.url;

      img.onload = () => {
        loadedCount += 1;

        if (loadedCount === photos.length && onReady) {
          onReady();
        }
      };

      img.onerror = () => {
        loadedCount += 1;

        if (loadedCount === photos.length && onReady) {
          onReady();
        }
      };
    });
  }, [photos, onReady]);

  return (
    <div className="travel-dome-gallery">
      <DomeGallery
        images={images}
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segmentsX={15}
        segmentsY={20}
        dragDampening={2}
        grayscale={false}
        overlayBlurColor="#ddebff"
        imageBorderRadius="24px"
        openedImageBorderRadius="24px"
      />
    </div>
  );
};

export default TravelDomeGallery;