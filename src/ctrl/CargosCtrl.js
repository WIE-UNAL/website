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

export const deleteCargo = async (id_cargo) => {
    const { data, error } = await supabase
        .from("cargos")
        .delete()
        .eq("id_cargo", id_cargo);
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data && data[0];
}

export const renameCargo = async (id_cargo, nuevoNombre) => {
    const { error } = await supabase
        .from("cargos")
        .update({ nombre: nuevoNombre })
        .eq("id_cargo", id_cargo)
        .select();
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }
}

export const createCargo = async (nombre) => {
    const { data, error } = await supabase
        .from("cargos")
        .insert([{ nombre }])
        .select();

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }
    
    return data && data[0];
}