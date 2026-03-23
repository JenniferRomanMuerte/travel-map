import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TravelDomeGallery from "../components/DomeGallery/TravelDomeGallery";
import CircularVideoGallery from "../components/CircularVideoGallery/CircularVideoGallery";
import TravelLoader from "../components/TravelLoader";
import TravelFormModal from "../components/TravelFormModal";
import ProcessModal from "../components/ProcessModal";
import ConfirmModal from "../components/ConfirmModal";
import { getPlaceById, updatePlace, deletePlace } from "../services/placesService";
import { getMediaByPlace, addFilesToPlace, removeMediaItem } from "../services/mediaService";

const PlacePage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [photosReady, setPhotosReady] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
  const [error, setError] = useState("");


  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingGalleryRefresh, setPendingGalleryRefresh] = useState(null);

  const [processModal, setProcessModal] = useState({
    isOpen: false,
    message: "",
    type: "success"
  });

  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    type: null, // "media" | "place" | null
    mediaItem: null,
  });

  const successTimeoutRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);


  function handlePhotosReady() {
    setPhotosReady(true);

    if (pendingGalleryRefresh === "photo") {
      closeProcessModal();
      setPendingGalleryRefresh(null);
    }
  }

  function handleVideosReady() {
    setVideosReady(true);

    if (pendingGalleryRefresh === "video") {
      closeProcessModal();
      setPendingGalleryRefresh(null);
    }
  }


  async function handleSaveEdit({ visitedAt, notes, files }) {
    if (!id) return;

    try {
      setError("");
      setIsSavingEdit(true);
      setUploadProgress(0);

      const updatedPlace = await updatePlace(id, {
        visited_at: visitedAt,
        notes,
      });

      setUploadProgress(15);

      let newMedia = [];

      if (files.length > 0) {
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const savedItems = await addFilesToPlace(id, [file]);
          newMedia = [...newMedia, ...savedItems];

          const progress = 15 + Math.round(((i + 1) / totalFiles) * 85);
          setUploadProgress(progress);
        }
      } else {
        setUploadProgress(100);
      }

      const updatedMedia = [...media, ...newMedia];

      setPlace(updatedPlace);
      setMedia(updatedMedia);

      const hasPhotos = updatedMedia.some((item) => item.type === "photo");
      const hasVideos = updatedMedia.some((item) => item.type === "video");

      if (hasPhotos) setPhotosReady(true);
      if (hasVideos) setVideosReady(true);

      setIsEditModalOpen(false);

      setProcessModal({
        isOpen: true,
        message: "Cambios guardados correctamente",
        type: "success"
      });

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => {
        closeProcessModal();
      }, 3000);

    } catch (err) {
      console.error("Error guardando cambios del viaje:", err);

      setProcessModal({
        isOpen: true,
        message: err?.message || "No se pudieron guardar los cambios",
        type: "error"
      });
    } finally {
      setIsSavingEdit(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 300);
    }
  }

  function handleDeleteMedia(mediaItem) {
    if (!mediaItem) return;

    setConfirmDeleteModal({
      isOpen: true,
      type: "media",
      mediaItem,
    });
  }

  async function confirmDeleteMedia() {
    const mediaItem = confirmDeleteModal.mediaItem;

    if (!mediaItem) return;

    try {
      await removeMediaItem(mediaItem);

      const updatedMedia = media.filter((item) => item.id !== mediaItem.id);
      setMedia(updatedMedia);

      setConfirmDeleteModal({
        isOpen: false,
        type: null,
        mediaItem: null,
      });

      const hasRemainingSameType = updatedMedia.some(
        (item) => item.type === mediaItem.type
      );

      setProcessModal({
        isOpen: true,
        message: "Archivo eliminado correctamente",
        type: "success"
      });

      if (hasRemainingSameType) {
        setPendingGalleryRefresh(mediaItem.type);
      } else {
        setPendingGalleryRefresh(null);

        setTimeout(() => {
          closeProcessModal();
        }, 900);
      }
    } catch (err) {
      console.error("Error eliminando archivo:", err);

      setConfirmDeleteModal({
        isOpen: false,
        mediaItem: null,
      });

      setPendingGalleryRefresh(null);

      setProcessModal({
        isOpen: true,
        message: err?.message || "No se pudo eliminar el archivo",
        type: "error"
      });
    }
  }


  async function confirmDeletePlace() {
    if (!id) return;

    try {
      await deletePlace(id);

      setConfirmDeleteModal({
        isOpen: false,
        type: null,
        mediaItem: null,
      });

      setProcessModal({
        isOpen: true,
        message: "Viaje eliminado correctamente",
        type: "success"
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error("Error eliminando viaje:", err);

      setConfirmDeleteModal({
        isOpen: false,
        type: null,
        mediaItem: null,
      });

      setProcessModal({
        isOpen: true,
        message: err?.message || "No se pudo eliminar el viaje",
        type: "error"
      });
    }
  }


  function handleDeletePlace() {
    if (!id) return;

    setConfirmDeleteModal({
      isOpen: true,
      type: "place",
      mediaItem: null,
    });
  }


  function closeProcessModal() {
    setProcessModal((prev) => ({ ...prev, isOpen: false }));
  }

  function closeConfirmDeleteModal() {
    setConfirmDeleteModal({
      isOpen: false,
      type: null,
      mediaItem: null,
    });
  }

  const photos = useMemo(() => {
    return media.filter((item) => item.type === "photo");
  }, [media]);

  const videos = useMemo(() => {
    return media.filter((item) => item.type === "video");
  }, [media]);

  const videoGalleryItems = useMemo(() => {
    const placeTitle =
      place?.city && place?.country
        ? `${place.city}, ${place.country}`
        : "Vídeo";

    return videos.map((video) => ({
      id: video.id,
      url: video.url,
      title: placeTitle,
      type: video.type,
      file_path: video.file_path,
    }));
  }, [videos, place?.city, place?.country]);

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
            <Link to="/" className="travel-page__back">
              ← Volver al mapa
            </Link>
            <h1 className="travel-page__title">
              {place.city}, {place.country}
            </h1>

            <div className="travel-page__info">
              <p className="travel-page__info-date">{formattedDate}</p>
              <div className="travel-page__info-actions">
                <button
                  type="button"
                  className="travel-page__edit-btn"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Editar viaje
                </button>
                <button
                  type="button"
                  className="travel-page__delete-btn"
                  onClick={handleDeletePlace}
                >
                  Eliminar Viaje
                </button>

              </div>
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
                key={photos.map((p) => p.id).join("-")}
                photos={photos}
                placeName={place.city || "viaje"}
                onReady={handlePhotosReady}
                onDeletePhoto={handleDeleteMedia}
              />
            )}
          </section>

          <section className="travel-page__section">
            <h2 className="travel-page__section-title">Vídeos</h2>

            {videos.length === 0 ? (
              <p className="travel-page__empty">No hay vídeos</p>
            ) : (
              <CircularVideoGallery
                key={videos.map((video) => video.id).join("-")}
                videos={videoGalleryItems}
                onReady={handleVideosReady}
                onDeleteVideo={handleDeleteMedia}
              />
            )}
          </section>
        </div>
      )}
      <TravelFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        mode="edit"
        initialData={place}
        isSaving={isSavingEdit}
        uploadProgress={uploadProgress}
      />
      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        title={
          confirmDeleteModal.type === "place"
            ? "Eliminar viaje"
            : "Eliminar archivo"
        }
        message={
          confirmDeleteModal.type === "place"
            ? "¿Seguro que quieres eliminar este viaje? Esta acción no se puede deshacer."
            : "¿Seguro que quieres eliminar este archivo?"
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        danger={true}
        onConfirm={
          confirmDeleteModal.type === "place"
            ? confirmDeletePlace
            : confirmDeleteMedia
        }
        onClose={closeConfirmDeleteModal}
      />
      <ProcessModal
        isOpen={processModal.isOpen}
        message={processModal.message}
        type={processModal.type}
        onClose={closeProcessModal}
        hideCloseButton={processModal.type === "success"}
      />

    </div>
  );
};

export default PlacePage;