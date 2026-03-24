import { supabase } from "../lib/supabase";

export async function uploadMediaFile(file) {
  if (!file) {
    throw new Error("No se recibió ningún archivo");
  }

  const formData = new FormData();
  formData.append("file", file);

  const { data, error } = await supabase.functions.invoke("r2-upload-media", {
    body: formData,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteMediaFile(filePath) {
  if (!filePath) {
    throw new Error("Ruta de archivo no válida");
  }

  const { data, error } = await supabase.functions.invoke("r2-delete-file", {
    body: { filePath },
  });

  if (error) {
    throw error;
  }

  return data;
}