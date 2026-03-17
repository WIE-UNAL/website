import { supabase } from "./SupabaseAPI";
import { getFotoProyecto } from "./StorageCtrl";
import { deleteUsuariosProyecto } from "./UsuarioCtrl";
import { deleteTagsFromProject } from "./TagsCtrl";

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


export const getProyectosDestacados = async () => {
  const { data, error } = await supabase
    .from("vw_proyectos_completos")
    .select("*")
    .eq("destacado", true) 
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


export const buscarProyectos = async (texto, estadosSeleccionados, tagsSeleccionados) => {
  const { data, error } = await supabase.rpc("buscar_proyectos_completos", {
      texto_busqueda: texto || null,
      estados_ids: estadosSeleccionados?.length > 0 ? estadosSeleccionados : null,
      p_tags_ids: tagsSeleccionados?.length > 0 ? tagsSeleccionados : null,
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

export const buscarProyectosLider = async (idUsuario) => {
  const { data, error } = await supabase.rpc("obtener_eventos_por_lider", { p_id_usuario: idUsuario.idUsuario });

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

export const updateProyecto = async (id, proyecto, vtools) => {
  
  const { data, error } = await supabase
    .from("proyectos")
    .update({
      nombre: proyecto.nombre,
      descripcion_c: proyecto.descripcion_c,
      descripcion: proyecto.descripcion,
      impacto: proyecto.impacto,
      avance: proyecto.avance,
      nuevos: proyecto.nuevos,
      destacado: proyecto.destacado,
      fecha_creacion: proyecto.fecha_creacion,
      vtools: vtools,
      estado: proyecto.estado
    })
    .eq("id_proyecto", id)
    .select();
  
  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return null;
  }
  
  const proyectoActualizado = data[0];
  proyectoActualizado.foto = await getFotoProyecto(proyectoActualizado.id_proyecto);
  return proyectoActualizado;
}

export const createProyecto = async (proyecto, vtools) => {
  const { data, error } = await supabase
    .from("proyectos")
    .insert([{
      nombre: proyecto.nombre,
      descripcion_c: proyecto.descripcion_c,
      descripcion: proyecto.descripcion,
      impacto: proyecto.impacto,
      avance: proyecto.avance,
      nuevos: proyecto.nuevos,
      destacado: proyecto.destacado,
      estado: proyecto.estado,
      fecha_creacion: proyecto.fecha_creacion,
      vtools: vtools
    }])
    .select();
  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
  return data && data[0];
};

export const deleteProyecto = async (id_proyecto) => {
  await deleteTagsFromProject(id_proyecto);
  await deleteUsuariosProyecto(id_proyecto);
  const { error } = await supabase
    .from('proyectos')
    .delete()
    .eq('id_proyecto', id_proyecto);
  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
};