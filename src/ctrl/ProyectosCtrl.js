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