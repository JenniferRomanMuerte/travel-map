export async function compressVideo(file) {

  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.muted = true;

  await new Promise(resolve => video.onloadedmetadata = resolve);

  const canvas = document.createElement("canvas");

  const maxWidth = 1280;
  const scale = Math.min(1, maxWidth / video.videoWidth);

  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const stream = canvas.captureStream();

  const recorder = new MediaRecorder(stream);

  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.start();

  await new Promise(resolve => setTimeout(resolve, 2000));

  recorder.stop();

  await new Promise(resolve => recorder.onstop = resolve);

  return new File(chunks, "compressed.webm", { type: "video/webm" });

}