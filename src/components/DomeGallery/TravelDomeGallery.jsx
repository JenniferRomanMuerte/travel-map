import DomeGallery from "./DomeGallery";


const TravelDomeGallery = ({ photos, placeName = "viaje" }) => {
  const images = photos.map((photo) => ({
    src: photo.url,
    alt: `Foto de ${placeName}`,
  }));

  return (
    <div className="travel-dome-gallery">
      <DomeGallery
        images={images}
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
        grayscale={false}
        overlayBlurColor="#ddebff"
        openedImageWidth="320px"
        openedImageHeight="420px"
        imageBorderRadius="24px"
        openedImageBorderRadius="24px"
      />
    </div>
  );
};

export default TravelDomeGallery;