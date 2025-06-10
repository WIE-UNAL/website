import { supabase } from "./SupabaseAPI";

export const getFotoProyecto = async (id) => {
    
  const path = `Proyectos/${id}.png`;
  const { data } = supabase
    .storage
    .from("img")
    .getPublicUrl(path);

  return data.publicUrl;
};