import { supabase } from "./SupabaseAPI";

export const getFotoProyecto = async (id) => {
  const path = `Proyectos/${id}.png`;
  const { data } = supabase
    .storage
    .from("img")
    .getPublicUrl(path);

  return data.publicUrl;
};

export const getDefaultProyect = () => {
  const { data } = supabase.storage.from("img").getPublicUrl(`Default/Proyecto.png`);
  return data.publicUrl;
};