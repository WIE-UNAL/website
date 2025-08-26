import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setLocalVTools(vtools || []);
  }, [vtools]);

  const handleVToolChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    const updatedVTools = [...localVTools];
    updatedVTools[index] = numericValue;
    
    setLocalVTools(updatedVTools);
    updateProject(updatedVTools);
  };

  const handleAddVTool = () => {
    if (newVTool.trim() === '') return;
    
    const numericValue = newVTool.replace(/[^0-9]/g, '');
    if (numericValue === '') return;

    if (localVTools.includes(numericValue)) {
      alert('Este vTool ID ya existe');
      return;
    }

    const updatedVTools = [...localVTools, numericValue];
    setLocalVTools(updatedVTools);
    setNewVTool('');
    updateProject(updatedVTools);
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
        vtools: updatedVTools
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
          localVTools.map((vtoolId, index) => (
            <div key={index} className="vtool-item">
              <div className="vtool-input-group">
                <span className="url-prefix">{urlPrefix}</span>
                <input
                  type="text"
                  value={vtoolId}
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
                  ×
                </button>
              </div>
              <div className="full-url-preview">
                <small>
                    <a
                        href={getFullUrl(vtoolId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                            {getFullUrl(vtoolId)}
                        </a>
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
          />
          <button
            type="button"
            onClick={handleAddVTool}
            disabled={!newVTool.trim()}
            className="add-btn"
          >
            Añadir
          </button>
        </div>
        <small className="add-help-text">
          Solo se permiten números. Presiona Enter para añadir rápidamente.
        </small>
      </div>
    </div>
  );
};