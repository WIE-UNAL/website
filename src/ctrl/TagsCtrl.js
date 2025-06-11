import { supabase } from "./SupabaseAPI";

export const getNombreById_Tag = async (Id) => {
    const { data, error } = await supabase
        .from("tags")
        .select("nombre")
        .eq("id_tag", Id);

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data[0].nombre;
};

export const getTags = async () => {
    const { data, error } = await supabase
        .from("tags")
        .select("*");

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data;
};