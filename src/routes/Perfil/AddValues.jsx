import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { getEstados, deleteEstado, renameEstado, createEstado } from "../../ctrl/EstadosCtrl";
import { getTags, deleteTag, renameTag, createTag } from "../../ctrl/TagsCtrl";
import { getCargos, deleteCargo, renameCargo, createCargo } from "../../ctrl/CargosCtrl";
import { getCarreras, deleteCarrera, renameCarrera, createCarrera } from "../../ctrl/CarrerasCtrl";
import { mostrarAlert, mostrarConfirmacion } from "../../util/Alert";
import loading from "../../resources/loading.gif";
import "./AddValues.css";

export const AddValues = () => {
    const [estados, setEstados] = useState([]);
    const [tags, setTags] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [state, setState] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setEstados(await getEstados());
                setTags(await getTags());
                setCargos(await getCargos());
                setCarreras(await getCarreras());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchEventos();
    }, []);

    const getCurrentData = () => {
        switch (state) {
            case 'estado': return estados;
            case 'tag': return tags;
            case 'cargo': return cargos;
            case 'carrera': return carreras;
            default: return [];
        }
    };

    const getIdField = () => {
        switch (state) {
            case 'estado': return 'id_estado';
            case 'tag': return 'id_tag';
            case 'cargo': return 'id_cargo';
            case 'carrera': return 'id_carrera';
            default: return 'id';
        }
    };

    const handleAdd = async () => {
        if (!newItemName.trim()) return;

        try {
            let newItem;
            switch (state) {
                case 'estado':
                    newItem = await createEstado(newItemName);
                    setEstados([...estados, newItem]);
                    break;
                case 'tag':
                    newItem = await createTag(newItemName);
                    setTags([...tags, newItem]);
                    break;
                case 'cargo':
                    newItem = await createCargo(newItemName);
                    setCargos([...cargos, newItem]);
                    break;
                case 'carrera':
                    newItem = await createCarrera(newItemName);
                    setCarreras([...carreras, newItem]);
                    break;
                default:
                    return;
            }
            setNewItemName('');
            await mostrarAlert("success", `${state.charAt(0).toUpperCase() + state.slice(1)} añadido correctamente`);
        } catch (error) {
            console.error(`Error adding ${state}:`, error);
            await mostrarAlert("error", `Error al añadir ${state}`);
        }
    };

    const handleDelete = async (id, nombre) => {
        const result = await mostrarConfirmacion(
            `¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            `¿Eliminar ${state}?`
        );

        if (result.isConfirmed) {
            try {
                switch (state) {
                    case 'estado':
                        await deleteEstado(id);
                        setEstados(estados.filter(item => item.id_estado !== id));
                        break;
                    case 'tag':
                        await deleteTag(id);
                        setTags(tags.filter(item => item.id_tag !== id));
                        break;
                    case 'cargo':
                        await deleteCargo(id);
                        setCargos(cargos.filter(item => item.id_cargo !== id));
                        break;
                    case 'carrera':
                        await deleteCarrera(id);
                        setCarreras(carreras.filter(item => item.id_carrera !== id));
                        break;
                    default:
                        return;
                }
                await mostrarAlert("success", `${state.charAt(0).toUpperCase() + state.slice(1)} eliminado correctamente`);
            } catch (error) {
                console.error(`Error deleting ${state}:`, error);
                if (error.code === '23503') {
                    await mostrarAlert("error", `No se puede eliminar porque está siendo usado por otros elementos.`);
                } else {
                    await mostrarAlert("error", `Error al eliminar ${state}`);
                }
            }
        }
    };

    const handleEdit = (item) => {
        const idField = getIdField();
        setEditingId(item[idField]);
        setEditingName(item.nombre);
    };

    const handleSaveEdit = async (id) => {
        if (!editingName.trim()) return;

        try {
            switch (state) {
                case 'estado':
                    await renameEstado(id, editingName);
                    setEstados(estados.map(item => 
                        item.id_estado === id ? { ...item, nombre: editingName } : item
                    ));
                    break;
                case 'tag':
                    await renameTag(id, editingName);
                    setTags(tags.map(item => 
                        item.id_tag === id ? { ...item, nombre: editingName } : item
                    ));
                    break;
                case 'cargo':
                    await renameCargo(id, editingName);
                    setCargos(cargos.map(item => 
                        item.id_cargo === id ? { ...item, nombre: editingName } : item
                    ));
                    break;
                case 'carrera':
                    await renameCarrera(id, editingName);
                    setCarreras(carreras.map(item => 
                        item.id_carrera === id ? { ...item, nombre: editingName } : item
                    ));
                    break;
                default:
                    return;
            }
            setEditingId(null);
            setEditingName('');
            await mostrarAlert("success", `${state.charAt(0).toUpperCase() + state.slice(1)} actualizado correctamente`);
        } catch (error) {
            console.error(`Error updating ${state}:`, error);
            await mostrarAlert("error", `Error al actualizar ${state}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    if (!carreras && !cargos && !tags && !estados) {
        return (
            <div className="error">
                <img src={loading} alt="Cargando..." className="loading" />
                <p className="no-projects">Cargando los datos...</p>
            </div>
        );
    }

    const currentData = getCurrentData();
    const idField = getIdField();

    return (
        <Container className="add-values">
            <div className="title-section">
                <h2>Gestionar Valores</h2>
                <hr />
            </div>

            {/* Botones de navegación */}
            <div className="valores">
                <Row>
                    <Col xs={12} sm={6} md={3}>
                        <button 
                            className={state === 'carrera' ? 'btn-add' : ''}
                            onClick={() => setState('carrera')}
                        >
                            <i className="fas fa-graduation-cap"></i> Carreras
                        </button>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <button 
                            className={state === 'cargo' ? 'btn-add' : ''}
                            onClick={() => setState('cargo')}
                        >
                            <i className="fas fa-briefcase"></i> Cargos
                        </button>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <button 
                            className={state === 'tag' ? 'btn-add' : ''}
                            onClick={() => setState('tag')}
                        >
                            <i className="fas fa-tags"></i> Tags
                        </button>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <button 
                            className={state === 'estado' ? 'btn-add' : ''}
                            onClick={() => setState('estado')}
                        >
                            <i className="fas fa-flag"></i> Estados
                        </button>
                    </Col>
                </Row>
            </div>

            {state && (
                <div className="valores">
                    <h3>
                        <i className="fas fa-list"></i>
                        {state.charAt(0).toUpperCase() + state.slice(1)}s
                    </h3>
                    
                    {/* Formulario para añadir nuevo */}
                    <div className="form-group">
                        <div className="text">Añadir {state === 'carrera' ? 'nueva' : 'nuevo'} {state}:</div>
                        <div className="input-group">
                            <div className="input-container">
                                <input 
                                    type="text" 
                                    placeholder={`Nombre ${state === 'carrera' ? 'de la' : 'del'} ${state}`}
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                />
                            </div>
                            <button 
                                className="btn-add" 
                                onClick={handleAdd} 
                                disabled={!newItemName.trim()}
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    {/* Lista de elementos existentes */}
                    <div className="form-group">
                        <div className="text">
                            <i className="fas fa-list-ul"></i>
                            Lista de {state}s ({currentData.length})
                        </div>
                        
                        {currentData.length > 0 ? (
                            <ul className="value-list">
                                {currentData.map((item) => (
                                    <li key={item[idField]} className="value-item">
                                        <div>
                                            {editingId === item[idField] ? (
                                                <input 
                                                    type="text" 
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(item[idField])}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span 
                                                    onDoubleClick={() => handleEdit(item)}
                                                    title="Doble clic para editar"
                                                >
                                                    {item.nombre}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="input-group">
                                            {editingId === item[idField] ? (
                                                <>
                                                    <button 
                                                        className="remove-btn"
                                                        onClick={() => handleSaveEdit(item[idField])}
                                                        title="Guardar"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    <button 
                                                        className="remove-btn"
                                                        onClick={handleCancelEdit}
                                                        title="Cancelar"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="remove-btn"
                                                        onClick={() => handleEdit(item)}
                                                        title="Editar"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="remove-btn"
                                                        onClick={() => handleDelete(item[idField], item.nombre)}
                                                        title="Eliminar"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text">No hay {state}s disponibles</p>
                        )}
                    </div>
                </div>
            )}
        </Container>
    );
};

export default AddValues;