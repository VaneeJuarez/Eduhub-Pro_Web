import React from "react";

import styles from '../styles/panel.module.css'


const ControlPanel = ({ showAddButton, showSearch, showToggle, searchTerm, setSearchTerm, selectedFilter, setSelectedFilter, toggleOptions = [] }) => (
  <div className="container mt-5">
    <div className="row align-items-center">
      {showAddButton && (
        <div className={`col-12 col-md-auto mb-2 ${styles.button}`}>
          <button className={`btn btn-primary ${styles.buttonAdd}`}>
            <i className="fas fa-plus"></i> Agregar
          </button>
        </div>
      )}

      {showSearch && (
        <div className={styles.searchContainer}>
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
        <div className={`btn-group ${styles.btnToggleGroup} ${styles.filtro}`} role="group">
          {toggleOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-outline-primary ${styles.toggle} ${selectedFilter === option ? "active" : ""}`}
              onClick={() => setSelectedFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ControlPanel;
