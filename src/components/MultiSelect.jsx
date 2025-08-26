import "./MultiSelect.css"
import React, { useState, useEffect } from 'react';

export const MultiTagSelector = ({ 
  tags, 
  proyecto, 
  setProyecto, 
  className = "" 
}) => {
  const [selectedTags, setSelectedTags] = useState([]);

  // Inicializar tags seleccionados cuando cambie el proyecto
  useEffect(() => {
    if (proyecto.tags_ids && Array.isArray(proyecto.tags_ids)) {
      setSelectedTags(proyecto.tags_ids);
    } else {
      setSelectedTags([]);
    }
  }, [proyecto.tags_ids]);

  // Manejar cambio en checkbox individual
  const handleTagChange = (tagId) => {
    let updatedTags;
    
    if (selectedTags.includes(tagId)) {
      // Remover tag si ya está seleccionado
      updatedTags = selectedTags.filter(id => id !== tagId);
    } else {
      // Agregar tag si no está seleccionado
      updatedTags = [...selectedTags, tagId];
    }
    
    setSelectedTags(updatedTags);
    
    // Actualizar el estado del proyecto
    setProyecto(prevProyecto => ({
      ...prevProyecto,
      tags_ids: updatedTags
    }));
  };

  return (
    <div className={`multi-tag-selector ${className}`}>
      
      <div className="tags-list">
        {tags.map((tag) => (
          <label key={tag.id_tag} className="tag-checkbox">
            <input
              type="checkbox"
              checked={selectedTags.includes(tag.id_tag)}
              onChange={() => handleTagChange(tag.id_tag)}
            />
            <span className="tag-name">{tag.nombre}</span>
          </label>
        ))}
      </div>
      
      <div className="selection-summary">
        <span>
          {selectedTags.length} de {tags.length} tags seleccionados
        </span>
      </div>
    </div>
  );
};