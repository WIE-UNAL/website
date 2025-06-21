import { supabase } from "./SupabaseAPI";
import { getFotoProyecto } from "./StorageCtrl";

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

  const proyectosConFoto = await Promise.all(
    data.map(async (proyecto) => {
      const foto = await getFotoProyecto(proyecto.id_proyecto);
      return { ...proyecto, foto };
    })
  );

  return proyectosConFoto;
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

  const proyectosConFoto = await Promise.all(
    data.map(async (proyecto) => {
      const foto = await getFotoProyecto(proyecto.id_proyecto);
      return { ...proyecto, foto };
    })
  );

  return proyectosConFoto;
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

  const proyectosConFoto = await Promise.all(
    data.map(async (proyecto) => {
      const foto = await getFotoProyecto(proyecto.id_proyecto);
      return { ...proyecto, foto };
    })
  );

  return proyectosConFoto;
};

export const getProyectoById = async (id) => {
  const { data, error } = await supabase
    .from("vw_proyectos_completos")
    .select("*")
    .eq("id_proyecto", id);

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return null;
  }
  
  const proyecto = data[0];
  
  proyecto.foto = await getFotoProyecto(proyecto.id_proyecto);

  return proyecto;
};