
const VideoOverlay = ({ video, onClose, onDelete }) => {
  if (!video) return null;

  async function handleDeleteClick() {
    if (!onDelete) return;

    try {
      await onDelete(video);
      onClose();
    } catch (error) {
      console.error("Error eliminando vídeo:", error);
    }
  }

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

        {onDelete && (
          <button
            className="video-overlay__delete"
            onClick={handleDeleteClick}
            type="button"
          >
            Eliminar
          </button>
        )}

        {video.title && <h3 className="video-overlay__title">{video.title}</h3>}

        <div className="video-overlay__media">
          <video
            className="video-overlay__player"
            src={video.url}
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );

};

export default VideoOverlay;