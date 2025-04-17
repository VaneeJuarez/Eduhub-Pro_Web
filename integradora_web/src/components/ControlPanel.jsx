import React from "react";

import styles from '../styles/panel.module.css'

const ControlPanel = ({ showAddButton, modalId, showSearch, showToggle, searchTerm, setSearchTerm, selectedFilter, setSelectedFilter, toggleOptions = [], onAddClick, onFilterClick, toggleLabels }) => {
  const handleFilterClick = (option) => {
    if (onFilterClick) {
      onFilterClick(option);
    } else {
      setSelectedFilter(option);
    }
  };

  // Función para obtener la etiqueta amigable para un valor de filtro
  const getFilterLabel = (option, index) => {
    // Si se proporcionan etiquetas personalizadas, úsalas
    if (toggleLabels && toggleLabels.length > index) {
      return toggleLabels[index];
    }
    
    // Etiquetas predeterminadas para valores comunes
    switch(option) {
      case "FINISHED": return "Pagado";
      case "PENDING_PAYMENT": return "Pendiente";
      default: return option;
    }
  };

  return (
  <div className="container mt-5 mb-4">
    <div className="row align-items-center justify-content-start g-3">
      {showAddButton && (
        <div className={`col-12 col-sm-auto ps-3 ${styles.button}`}>
          <button className={`btn btn-primary ${styles.buttonAdd}`}
          onClick={() => {
            if (onAddClick) onAddClick();
          }}
          >
            <i className="fas fa-plus"></i> Agregar
          </button>
        </div>
      )}

      {showSearch && (
        <div className={`col-12 col-sm ${styles.searchContainer}`}>
          <div className={styles.inputGroup}>
            <div className={styles.iconContainer}>
              <i className={`bi bi-search ${styles.searchIcon}`}></i>
            </div>
            <input
              type="text"
              className={`form-control ${styles.search}`}
              placeholder="Búsqueda"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {showToggle && toggleOptions.length > 0 && (
        <div className={`col-12 col-sm-auto btn-group ${styles.btnToggleGroup} ${styles.filtro}`} role="group">
          {toggleOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-outline-primary ${styles.toggle} ${selectedFilter === option ? "active" : ""}`}
              onClick={() => handleFilterClick(option)}
            >
              {getFilterLabel(option, index)}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default ControlPanel;
