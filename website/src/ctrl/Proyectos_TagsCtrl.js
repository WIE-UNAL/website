import { supabase } from "./SupabaseAPI";

export const getTagsByIdEvent = async (Id) => {
    const { data, error } = await supabase
        .from("proyectos_tags")
        .select("id_tag")
        .eq("id_proyecto", Id);

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data;
};