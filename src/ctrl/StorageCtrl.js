import { supabase } from "./SupabaseAPI";

export const getFotoProyecto = async (id) => {
  const path = `Proyectos/${id}.png`;

  const { data: fileExists, error } = await supabase
    .storage
    .from("img")
    .list("Proyectos", { search: `${id}.png` });

  if (error || !fileExists || fileExists.length === 0) {
    return getDefaultProyect();
  }

  const { data } = supabase
    .storage
    .from("img")
    .getPublicUrl(path);

  return data?.publicUrl || getDefaultProyect();
};

export const getDefaultProyect = () => {
  const { data } = supabase.storage.from("img").getPublicUrl(`Default/Proyecto.png`);
  return data.publicUrl;
};

export const getFotoUsuario = async (id) => {
  const path = `Usuarios/${id}.png`;

  const { data: fileExists, error } = await supabase
    .storage
    .from("img")
    .list("Usuarios", { search: `${id}.png` });

  if (error || !fileExists || fileExists.length === 0) {
    return getDefaultUsuario();
  }

  const { data } = supabase
    .storage
    .from("img")
    .getPublicUrl(path);

  return data?.publicUrl || getDefaultUsuario();
};

export const getDefaultUsuario = () => {
  const { data } = supabase.storage.from("img").getPublicUrl(`Default/Usuario.png`);
  return data.publicUrl;
};

export const subirFotoUsuario = async (file, userId) => {
  const path = `Usuarios/${userId}.png`;

  // eslint-disable-next-line
  const { data, error } = await supabase.storage
    .from('img')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  return await getFotoUsuario(userId);
}