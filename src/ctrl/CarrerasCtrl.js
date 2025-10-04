import { supabase } from "./SupabaseAPI";

export const getCarreras = async () => {
    const { data, error } = await supabase
        .from("carreras")
        .select("*");

    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data;
};

export const deleteCarrera = async (id) => {
    const { data, error } = await supabase
        .from("carreras")
        .delete()
        .eq("id_carrera", id);
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data && data[0];
}

export const renameCarrera = async (id, nuevoNombre) => {
    const { error } = await supabase
        .from("carreras")
        .update({ nombre: nuevoNombre })
        .eq("id_carrera", id)
        .select();
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }
}

export const createCarrera = async (nombre) => {
    const { data, error } = await supabase
        .from("carreras")
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