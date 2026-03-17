import { supabase } from "./SupabaseAPI";

export const getNombreById_Estado = async (Id) => {
    const { data, error } = await supabase
        .from("estados")
        .select("nombre")
        .eq("id_estado", Id);

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data[0].nombre;
};

export const getEstados = async () => {
    const { data, error } = await supabase
        .from("estados")
        .select("*");

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data;
}

export const deleteEstado = async (id) => {
    const { data, error } = await supabase
        .from("estados")
        .delete()
        .eq("id_estado", id);
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data && data[0];
}

export const renameEstado = async (id, nuevoNombre) => {
    const { error } = await supabase
        .from("estados")
        .update({ nombre: nuevoNombre })
        .eq("id_estado", id)
        .select();
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }
}

export const createEstado = async (nombre) => {
    const { data, error } = await supabase
        .from("estados")
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