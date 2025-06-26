import { supabase } from "./SupabaseAPI";

export const getCargos = async () => {
    const { data, error } = await supabase
        .from("cargos")
        .select("*");

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data;
}