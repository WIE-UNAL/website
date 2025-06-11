import { supabase } from "./SupabaseAPI";

export const getProyectosDestacados = async () => {
  const { data, error } = await supabase.rpc("get_random_proyectos");

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  return data;
};

export const buscarProyectos = async (texto, estadosSeleccionados, tagsSeleccionados) => {
  const { data, error } = await supabase.rpc("buscar_proyectos", {
    texto_busqueda: texto || null,
    estados_ids: estadosSeleccionados?.length > 0 ? estadosSeleccionados : null,
    tags_ids: tagsSeleccionados?.length > 0 ? tagsSeleccionados : null,
  });

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  return data;
};

export const getProyectos = async () => {
  const { data, error } = await supabase
    .from("proyectos")
    .select("*");

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  return data;
};

export const getProyectoById = async (Id) => {
  const { data, error } = await supabase
    .from("proyectos")
    .select("*")
    .eq("id_proyecto", Id);

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  return data;
};