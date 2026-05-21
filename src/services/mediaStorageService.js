import { api } from "../lib/api";

export async function uploadMediaFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/r2/upload", formData);
}

export async function deleteMediaFile(filePath) {
  return api.delete("/r2/file", { filePath });
}
