
const VideoOverlay = ({ videoUrl, title, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="video-overlay" onClick={onClose}>
      <div
        className="video-overlay__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="video-overlay__close"
          onClick={onClose}
          aria-label="Cerrar vídeo"
        >
          ×
        </button>

        {title && <h3 className="video-overlay__title">{title}</h3>}

        <video
          className="video-overlay__player"
          src={videoUrl}
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
};

export default VideoOverlay;