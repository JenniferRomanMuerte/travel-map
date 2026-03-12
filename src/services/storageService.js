import { supabase } from "../lib/supabase";

export async function uploadFile(file) {

  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  const filePath = `media/${fileName}`;


  const { error } = await supabase.storage
    .from("travel-media")
    .upload(filePath, file, {
      contentType: file.type
    });

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from("travel-media")
    .getPublicUrl(filePath);

  return publicData.publicUrl;


}