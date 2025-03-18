import React, { useState, useRef, useEffect } from "react";

export default function CheckboxMultiSelect() {
  const options = [
    { value: "programación", label: "Programación" },
    { value: "informática", label: "Informática" },
    { value: "marketing", label: "Marketing" },
    { value: "diseño", label: "Diseño" },
    { value: "negocios", label: "Negocios" },
    { value: "ciencias", label: "Ciencias" },
    { value: "comunicación", label: "Comunicación"}
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Seleccionados: ${selectedOptions.map((opt) => opt.label).join(", ")}`);
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    setSelectedOptions((prev) => prev.filter((item) => item.value !== option.value));
  };

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.some((item) => item.value === option.value);
      return isSelected ? prev.filter((item) => item.value !== option.value) : [...prev, option];
    });
  };

  return (
    <div className="mb-3">
            <label className="form-label">Selecciona categorías</label>
            <div className="position-relative" ref={dropdownRef}>
              {/* Dropdown trigger */}
              <div
                className="form-control d-flex align-items-center"
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex flex-wrap gap-2 flex-grow-1">
                  {selectedOptions.length === 0 ? (
                    <span className="text-muted">Selecciona opciones...</span>
                  ) : (
                    selectedOptions.map((option) => (
                      <div key={option.value} className="badge bg-secondary d-flex align-items-center gap-1">
                        {option.label}
                        <i className="bi bi-x ms-1" style={{ cursor: "pointer" }} onClick={(e) => removeOption(option, e)}></i>
                      </div>
                    ))
                  )}
                </div>
                <div className="ms-2">
                  <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </div>
              </div>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="dropdown-menu show w-100 p-2 shadow-sm" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {options.map((option) => {
                    const isSelected = selectedOptions.some((item) => item.value === option.value);
                    return (
                      <div key={option.value} className="dropdown-item d-flex align-items-center" onClick={() => handleOptionClick(option)}>
                        <input type="checkbox" className="form-check-input me-2" checked={isSelected} readOnly />
                        <label className="form-check-label">{option.label}</label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
  );
}
