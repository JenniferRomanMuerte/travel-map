import { useEffect, useState } from "react";
import VideoOverlay from "./VideoOverlay/VideoOverlay";
import CircularGallery from "./CircularGallery";


const CircularVideoGallery = ({ videos, onReady, onDeleteVideo }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    if (!videos || videos.length === 0) return;

    const generateVideoThumbnail = (videoUrl) => {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.addEventListener("loadeddata", () => {
          video.currentTime = 0.1;
        });

        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 800;
          canvas.height = video.videoHeight || 450;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const thumbnail = canvas.toDataURL("image/jpeg", 0.8);
          resolve(thumbnail);
        });

        video.addEventListener("error", () => {
          resolve("https://picsum.photos/seed/video/800/600");
        });
      });
    };

    const buildGalleryItems = async () => {
      const items = await Promise.all(
        videos.map(async (video) => {
          const thumbnail = video.poster || (await generateVideoThumbnail(video.url));

          return {
            id: video.id,
            image: thumbnail,
            text: video.title || "Vídeo",
            url: video.url,
            title: video.title || "Vídeo",
            type: video.type,
            file_path: video.file_path,
          };
        })
      );

      setGalleryItems(items);

      requestAnimationFrame(() => {
        if (onReady) onReady();
      });
    };

    buildGalleryItems();
  }, [videos, onReady]);

  useEffect(() => {
    if (!selectedVideo) return;

    const stillExists = videos.some((video) => video.id === selectedVideo.id);

    if (!stillExists) {
      setSelectedVideo(null);
    }
  }, [videos, selectedVideo]);

  if (!videos || videos.length === 0) return null;



  return (
    <>
      <section className="circular-video-gallery">

        <div className="circular-video-gallery__wrapper">
          <CircularGallery
            items={galleryItems}
            bend={1}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
            onItemClick={(item) => setSelectedVideo(item)}
          />
        </div>
      </section>

      <VideoOverlay
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onDelete={onDeleteVideo}
      />
    </>
  );
};

export default CircularVideoGallery;