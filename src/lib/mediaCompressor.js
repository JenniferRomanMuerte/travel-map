export async function compressVideo(file) {
  if (!file || !file.type.startsWith("video/")) {
    throw new Error("Archivo de vídeo no válido");
  }

  const video = document.createElement("video");
  const objectUrl = URL.createObjectURL(file);

  video.src = objectUrl;
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";

  let animationFrameId = null;

  try {
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = () => reject(new Error("No se pudo cargar el vídeo"));
    });

    const canvas = document.createElement("canvas");

    const maxWidth = 960;
    const scale = Math.min(1, maxWidth / video.videoWidth);

    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No se pudo obtener el contexto del canvas");
    }

    const fps = 24;
    const stream = canvas.captureStream(fps);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 900_000,
    });

    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    function drawFrame() {
      if (video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(drawFrame);
    }

    recorder.start();

    await video.play();
    drawFrame();

    await new Promise((resolve) => {
      video.onended = resolve;
    });

    recorder.stop();

    await new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    const compressedFile = new File(
      chunks,
      file.name.replace(/\.\w+$/, ".webm"),
      { type: "video/webm" }
    );

    console.log(
      "Vídeo original:",
      file.name,
      (file.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    console.log(
      "Vídeo comprimido:",
      compressedFile.name,
      (compressedFile.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    return compressedFile;
  } finally {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    URL.revokeObjectURL(objectUrl);
  }
}

export async function compressImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Archivo de imagen no válido");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No se pudo obtener el contexto del canvas");
    }

    const maxWidth = 1600;
    const maxHeight = 1600;

    const widthRatio = maxWidth / image.width;
    const heightRatio = maxHeight / image.height;
    const scale = Math.min(1, widthRatio, heightRatio);

    const targetWidth = Math.round(image.width * scale);
    const targetHeight = Math.round(image.height * scale);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error("No se pudo generar la imagen comprimida"));
            return;
          }
          resolve(result);
        },
        "image/webp",
        0.8
      );
    });

    const baseName = file.name.replace(/\.\w+$/, "");
    const compressedFile = new File(
      [blob],
      `${baseName}.webp`,
      { type: "image/webp" }
    );

    console.log(
      "Imagen original:",
      file.name,
      (file.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    console.log(
      "Imagen comprimida:",
      compressedFile.name,
      (compressedFile.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    return compressedFile;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}