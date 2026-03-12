export async function compressVideo(file) {

  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.muted = true;
  video.playsInline = true;

  // esperar metadata
  await new Promise(resolve => {
    video.onloadedmetadata = resolve;
  });

  const canvas = document.createElement("canvas");

  const maxWidth = 1280;
  const scale = Math.min(1, maxWidth / video.videoWidth);

  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;

  const ctx = canvas.getContext("2d");

  // capturamos el stream del canvas
  const stream = canvas.captureStream(30);

  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
    videoBitsPerSecond: 2_000_000 // bitrate reducido
  });

  const chunks = [];

  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // dibujar cada frame del vídeo en el canvas
  function drawFrame() {
    if (video.paused || video.ended) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawFrame);
  }

  recorder.start();

  video.play();
  drawFrame();

  await new Promise(resolve => {
    video.onended = resolve;
  });

  recorder.stop();

  await new Promise(resolve => {
    recorder.onstop = resolve;
  });

  // liberar memoria
  URL.revokeObjectURL(video.src);

  return new File(
    chunks,
    file.name.replace(/\.\w+$/, ".webm"),
    { type: "video/webm" }
  );
}