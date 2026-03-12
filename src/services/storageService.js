import { supabase } from "../lib/supabase";

export async function uploadFile(file) {

  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  const filePath = `media/${fileName}`;

  console.log(file.type);
  console.log(file.name);
  console.log(file.size);
  const { error } = await supabase.storage
    .from("travel-media")
    .upload(filePath, file, file, {
      contentType: file.type
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("travel-media")
    .getPublicUrl(filePath);

  return data.publicUrl;
}