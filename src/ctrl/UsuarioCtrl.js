import { supabase } from "./SupabaseAPI";
import { getFotoUsuario } from "./StorageCtrl";

export const UsuarioNuevo = async (correo) => {
  const { data, error } = await supabase.from("usuario").select("id_usuario").eq("correo", correo);

  if (error) {
      console.error("[Supabase Error] message:", error.message);
      console.error("[Supabase Error] details:", error.details);
      console.error("[Supabase Error] hint:", error.hint);
      throw error;
  }

  return data[0];
};

export const editarUsuario = async (usuario) => {
  const { data, error } = await supabase
    .from("usuario")
    .update({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      cumple: usuario.cumple,
      id_carrera: usuario.id_carrera
    })
    .eq("id_usuario", usuario.id_usuario);

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data;
}

export const insertarUsuario = async (usuario) => {
  const { data, error } = await supabase
    .from("usuario")
    .insert([
      {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        cumple: usuario.cumple, 
        id_carrera: usuario.id_carrera
      },
    ]).select();
  if (error) {
    console.error("Error al insertar usuario:", error.message);
    throw error;
  }
  return data;
};

export const getUsuarioByID = async (Id) => {
    const { data, error } = await supabase
      .from("vw_usuarios_completos")
      .select("*")
      .eq("id_usuario", Id);

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }
    
    const usuario = data[0];
    
    usuario.foto = await getFotoUsuario(usuario.id_usuario);

    return usuario;
};

export const getUsuarioByCorreo = async (correo) => {
    const { data, error } = await supabase
      .from("vw_usuarios_completos")
      .select("*")
      .eq("correo", correo);

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }
    
    const usuario = data[0];
    
    usuario.foto = await getFotoUsuario(usuario.id_usuario);

    return usuario;
};

export const getUsuarios = async () => {
  const { data, error } = await supabase
    .from("vw_usuarios_completos")
    .select("*");
  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  const usuariosConFoto = await Promise.all(
    data.map(async (proyecto) => {
      const foto = await getFotoUsuario(proyecto.id_usuario);
      return { ...proyecto, foto };
    })
  );

  return usuariosConFoto;
};

export const buscarUsuarios = async (texto, proyectosSeleccionados) => {
  const { data, error } = await supabase.rpc("buscar_usuarios_completos", {
      texto_busqueda: texto || null,
      proyecto_ids: proyectosSeleccionados?.length > 0 ? proyectosSeleccionados : null
    });

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  const usuariosConFoto = await Promise.all(
    data.map(async (proyecto) => {
      const foto = await getFotoUsuario(proyecto.id_usuario);
      return { ...proyecto, foto };
    })
  );

  console.log(proyectosSeleccionados, usuariosConFoto)

  return usuariosConFoto;
};

export const buscarUsuariosProyecto = async (idProyecto) => {
  const { data, error } = await supabase.rpc("buscar_usuarios_por_proyecto", {
      proyecto_id: idProyecto
    });

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  const proyectosConFoto = await Promise.all(
    data.map(async (usuario) => {
      const foto = await getFotoUsuario(usuario.id_usuario);
      return { ...usuario, foto };
    })
  );

  return proyectosConFoto;
};

