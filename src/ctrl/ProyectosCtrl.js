import { supabase } from "./SupabaseAPI";

// Obtener todos los proyectos
export const getProyectos = async () => {
  const { data, error } = await supabase
    .from("vw_proyectos_completos")
    .select("*");
  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
  return data;
};

// Obtener 3 proyectos destacados aleatorios
export const getProyectosDestacados = async () => {
  const { data, error } = await supabase
    .from("vw_proyectos_completos")
    .select("*")
    .eq("destacado", true) // Solo proyectos destacados
    .limit(3);

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
  return data;
};

// Buscar proyectos con filtros
export const buscarProyectos = async (texto, estadosSeleccionados, tagsSeleccionados) => {
  const { data, error } = await supabase.rpc("buscar_proyectos_completos", {
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

// Obtener un proyecto específico por ID
export const getProyectoById = async (Id) => {
  const { data, error } = await supabase
    .from("vw_proyectos_completos")
    .select("*")
    .eq("id_proyecto", Id);

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  return data[0];
};