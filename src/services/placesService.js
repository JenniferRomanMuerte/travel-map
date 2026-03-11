import { supabase } from "../lib/supabase";

export async function savePlace(place) {

  const { data, error } = await supabase
    .from("places")
    .insert([place]);

  if (error) {
    console.error("Error guardando lugar:", error);
  }

  return data;
}

export async function getPlaces() {

  const { data, error } = await supabase
    .from("places")
    .select("*");

  if (error) {
    console.error("Error leyendo lugares:", error);
    return [];
  }

  return data;
}