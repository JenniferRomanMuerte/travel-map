import { supabase } from "../lib/supabase";

export async function register(email, password) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  return data;
}

export async function login(email, password) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data;
}

export async function logout() {

  const { error } = await supabase.auth.signOut();

  if (error) throw error;

}

export async function getCurrentUser() {

  const { data } = await supabase.auth.getUser();

  return data?.user || null;

}