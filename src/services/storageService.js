import { supabase } from "../lib/supabase";

export async function uploadFile(file) {
  if (!file) {
    throw new Error("Archivo no válido");
  }

  const fileExt = file.name?.split(".").pop() || "bin";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
  const filePath = `media/${fileName}`;

  const { error } = await supabase.storage
    .from("travel-media")
    .upload(filePath, file, {
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from("travel-media")
    .getPublicUrl(filePath);

  if (!publicData?.publicUrl) {
    throw new Error("No se pudo obtener la URL pública del archivo");
  }

  return {
    url: publicData.publicUrl,
    filePath,
  };
}

export async function deleteFile(filePath) {
  if (!filePath) return;

  const { error } = await supabase.storage
    .from("travel-media")
    .remove([filePath]);

  if (error) {
    throw error;
  }
}