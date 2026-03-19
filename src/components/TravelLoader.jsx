const TravelLoader = ({ text = "Viajando..." }) => {
  return (
    <div className="travel-loader" aria-live="polite" aria-label={text}>
      <div className="travel-loader__track">
        <div className="travel-loader__vehicle">
          <img
            src="/airplane.webp"
            alt=""
            className="travel-loader__vehicle-image"
          />
        </div>
      </div>

      <p className="travel-loader__text">{text}</p>
    </div>
  );
};

export default TravelLoader;