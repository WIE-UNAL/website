import React, { useState, useEffect } from 'react';
import { getEventTitle } from '../ctrl/vTools'; // ✅ Importar tu función
import "./vTools.css"

export const VToolsManager = ({ 
    vtools = [], 
    onVToolsChange, 
    proyecto, 
    setProyecto,
    urlPrefix = "https://events.vtools.ieee.org/m/" 
  }) => {

  const [localVTools, setLocalVTools] = useState(vtools || []);
  const [newVTool, setNewVTool] = useState('');
  const [loadingTitle, setLoadingTitle] = useState(false); // ✅ Estado para loading

  useEffect(() => {
    setLocalVTools(vtools || []);
  }, [vtools]);

  const handleVToolChange = async (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const updatedVTools = [...localVTools];
    
    // ✅ Actualizar el ID del objeto existente
    if (numericValue === '') {
      updatedVTools[index] = { id: '', title: '' };
    } else {
      setLoadingTitle(true);
      try {
        const title = await getEventTitle(numericValue);
        updatedVTools[index] = { 
          id: parseInt(numericValue), 
          title: title || `Event ${numericValue}` 
        };
      } catch (error) {
        console.error('Error getting title:', error);
        updatedVTools[index] = { 
          id: parseInt(numericValue), 
          title: `Event ${numericValue}` 
        };
      }
      setLoadingTitle(false);
    }
    
    setLocalVTools(updatedVTools);
    updateProject(updatedVTools);
  };

  const handleAddVTool = async () => {
    if (newVTool.trim() === '') return;

    const numericValue = newVTool.replace(/[^0-9]/g, '');
    if (numericValue === '') return;

    // ✅ Verificar si el ID ya existe (comparando con objetos)
    if (localVTools.some(vtool => vtool.id === parseInt(numericValue))) {
      alert('Este vTool ID ya existe');
      return;
    }

    setLoadingTitle(true);
    
    try {
      // ✅ Obtener el título del nuevo evento
      const title = await getEventTitle(numericValue);
      
      // ✅ Crear objeto con id y title
      const newVToolObj = {
        id: parseInt(numericValue),
        title: title || `Event ${numericValue}`
      };

      const updatedVTools = [...localVTools, newVToolObj];
      setLocalVTools(updatedVTools);
      setNewVTool('');
      updateProject(updatedVTools);
      
    } catch (error) {
      console.error('Error getting title:', error);
      // ✅ Crear objeto incluso si falla la API
      const newVToolObj = {
        id: parseInt(numericValue),
        title: `Event ${numericValue}`
      };
      
      const updatedVTools = [...localVTools, newVToolObj];
      setLocalVTools(updatedVTools);
      setNewVTool('');
      updateProject(updatedVTools);
    }
    
    setLoadingTitle(false);
  };

  const handleRemoveVTool = (index) => {
    const updatedVTools = localVTools.filter((_, i) => i !== index);
    setLocalVTools(updatedVTools);
    updateProject(updatedVTools);
  };

  const handleNewVToolChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewVTool(numericValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVTool();
    }
  };

  const updateProject = (updatedVTools) => {
    if (setProyecto && proyecto) {
      setProyecto({
        ...proyecto,
        vtools: updatedVTools // ✅ Pasar objetos completos {id, title}
      });
    }

    // Callback opcional para manejar cambios
    if (onVToolsChange) {
      onVToolsChange(updatedVTools);
    }
  };

  const getFullUrl = (vtoolId) => {
    return `${urlPrefix}${vtoolId}`;
  };

  return (
    <div className="vtools-manager">
      <div className="vtools-list">
        {localVTools.length > 0 ? (
          localVTools.map((vtoolObj, index) => ( // ✅ Cambié vtoolId por vtoolObj
            <div key={index} className="vtool-item">
              <div className="vtool-input-group">
                <span className="url-prefix">{urlPrefix}</span>
                <input
                  type="text"
                  value={vtoolObj.id || ''} // ✅ Manejar caso donde id puede ser undefined
                  onChange={(e) => handleVToolChange(index, e.target.value)}
                  placeholder="12345"
                  className="vtool-input"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVTool(index)}
                  className="remove-btn"
                  title="Eliminar vTool"
                >
                  x
                </button>
              </div>
              <div className="full-url-preview">
                <small>
                  {vtoolObj.id ? (
                    <a
                      href={getFullUrl(vtoolObj.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getFullUrl(vtoolObj.id)} | {vtoolObj.title || 'Loading...'}
                    </a>
                  ) : (
                    <span>Ingresa un ID válido</span>
                  )}
                </small>
              </div>
            </div>
          ))
        ) : (
          <div className="no-vtools-message">
            No hay vTools configurados
          </div>
        )}
      </div>

      <div className="add-vtool-section">
        <div className="add-input-group">
          <span className="url-prefix-add">{urlPrefix}</span>
          <input
            type="text"
            value={newVTool}
            onChange={(e) => handleNewVToolChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa ID numérico"
            className="new-vtool-input"
            pattern="[0-9]*"
            inputMode="numeric"
            disabled={loadingTitle} // ✅ Deshabilitar mientras carga
          />
          <button
            type="button"
            onClick={handleAddVTool}
            disabled={!newVTool.trim() || loadingTitle}
            className="add-btn"
          >
            {loadingTitle ? '...' : '+'} {/* ✅ Mostrar loading */}
          </button>
        </div>
        <small className="add-help-text">
          Solo se permiten números. Presiona Enter para añadir rápidamente.
          {loadingTitle && <span> Obteniendo título del evento...</span>}
        </small>
      </div>
    </div>
  );
};