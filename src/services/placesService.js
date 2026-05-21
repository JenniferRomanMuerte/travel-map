import { api } from "../lib/api";

export async function createPlace(data) {
  return api.post("/places", data);
}

export async function getPlaces() {
  return api.get("/places");
}

export async function getPlaceById(id) {
  return api.get(`/places/${id}`);
}

export async function updatePlace(placeId, updates) {
  return api.put(`/places/${placeId}`, updates);
}

export async function deletePlace(placeId) {
  await api.delete(`/places/${placeId}`);
  return true;
}
