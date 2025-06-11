import { getNombreById_Estado } from "../ctrl/EstadosCtrl.js";
import { getTagsByIdEvent } from "../ctrl/Proyectos_TagsCtrl.js";
import { getNombreById_Tag } from "../ctrl/TagsCtrl.js";
import { getFotoProyecto } from "../ctrl/StorageCtrl.js";

export const procesarProyectos = async (proyectosRaw) => {
    return Promise.all(
        proyectosRaw.map(async (proyecto) => {
        const nombreEstado = await getNombreById_Estado(proyecto.estado);
        const tagRelations = await getTagsByIdEvent(proyecto.id_proyecto);
        const tags = await Promise.all(
            tagRelations.map(async (rel) => {
            const nombreTag = await getNombreById_Tag(rel.id_tag);
            return nombreTag;
            })
        );

        const fotoURL = await getFotoProyecto(proyecto.id_proyecto);

        return {
            ...proyecto,
            estado: nombreEstado,
            tags,
            foto: fotoURL,
        };
        })
    );
};

export const procesarProyecto = async (proyecto) => {
    const nombreEstado = await getNombreById_Estado(proyecto.estado);
    const tagRelations = await getTagsByIdEvent(proyecto.id_proyecto);
    const tags = await Promise.all(
        tagRelations.map(async (rel) => {
        const nombreTag = await getNombreById_Tag(rel.id_tag);
        return nombreTag;
        })
    );

    const fotoURL = await getFotoProyecto(proyecto.id_proyecto);

    return {
        ...proyecto,
        estado: nombreEstado,
        tags,
        foto: fotoURL,
    };
};