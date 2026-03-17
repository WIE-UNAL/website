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

export async function addTagToProject(id_proyecto, id_tag) {
    const { data, error } = await supabase
        .from("proyectos_tags")
        .upsert([{ id_proyecto, id_tag }], { onConflict: ["id_proyecto", "id_tag"] });

    if (error) {
        console.error("Error al añadir tag:", error);
        throw error;
    }
    return data;
}

export async function removeTagFromProject(id_proyecto, id_tag) {
    const { error } = await supabase
        .from("proyectos_tags")
        .delete()
        .match({ id_proyecto, id_tag });

    if (error) {
        console.error("Error al eliminar tag:", error);
        throw error;
    }
}

export async function deleteTagsFromProject(id_proyecto) {
    const { error } = await supabase
        .from("proyectos_tags")
        .delete()
        .eq("id_proyecto", id_proyecto);
        
    if (error) {
        console.error("Error al eliminar tag:", error);
        throw error;
    }
}

export const deleteTag = async (id) => {
    const { data, error } = await supabase
        .from("tags")
        .delete()
        .eq("id_tag", id);
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }

    return data && data[0];
}

export const renameTag = async (id, nuevoNombre) => {
    const { error } = await supabase
        .from("tags")
        .update({ nombre: nuevoNombre })
        .eq("id_tag", id)
        .select();
    
    if (error) {
        console.error("[Supabase Error] message:", error.message);
        console.error("[Supabase Error] details:", error.details);
        console.error("[Supabase Error] hint:", error.hint);
        throw error;
    }
}

export const createTag = async (nombre) => {
    const { data, error } = await supabase
        .from("tags")
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