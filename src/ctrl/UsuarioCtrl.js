import { supabase } from "./SupabaseAPI";

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
        id_carrera: usuario.id_carrera,
        id_cargo: 5
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

    return data[0];
};