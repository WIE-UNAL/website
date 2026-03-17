import { supabase } from "./SupabaseAPI";

export const addCorreo = async (newCorreo) => {
  const { data: existingCorreo, error: selectError } = await supabase
    .from("email_suscripcion")
    .select("correo")
    .eq("correo", newCorreo)
    .single(); 

  if (selectError && selectError.code !== "PGRST116") {
    console.error("[Supabase Error] message:", selectError.message);
    throw selectError;
  }

  if (existingCorreo) {
    return { message: "El correo ya está suscrito.", exists: true };
  }

  const { data, error } = await supabase
    .from("email_suscripcion")
    .insert([{ correo: newCorreo }])
    .select();

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }
  
  return { message: "Correo registrado con éxito.", exists: false, data: data[0] };
};

export const removeCorreo = async (correo) => {
  const { data, error } = await supabase
    .from("email_suscripcion")
    .delete()
    .eq("correo", correo); 

  if (error) {
    console.error("[Supabase Error] message:", error.message);
    console.error("[Supabase Error] details:", error.details);
    console.error("[Supabase Error] hint:", error.hint);
    throw error;
  }

  return data;
}