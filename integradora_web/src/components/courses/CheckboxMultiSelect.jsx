import React, { useState, useRef, useEffect } from "react";

export default function CheckboxMultiSelect({ options, value = [], onChange }) {

  const [isOpen, setIsOpen] = useState(false);
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

  const removeOption = (val, e) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== val));
  };

  const handleOptionClick = (option) => {
    const isSelected = value.includes(option.value);
    const newValue = isSelected
      ? value.filter((val) => val !== option.value)
      : [...value, option.value];

    onChange(newValue); // Actualiza al padre (CourseModal)
  };

  return (
    <div className="mb-3">
      <label className="form-label">Selecciona categorías</label>
      <div className="position-relative" ref={dropdownRef}>
        <div
          className="form-control d-flex align-items-center"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex flex-wrap gap-2 flex-grow-1">
            {value.length === 0 ? (
              <span className="text-muted">Selecciona opciones...</span>
            ) : (
              value.map((val) => {
                const label = options.find((opt) => opt.value === val)?.label || val;
                return (
                  <div key={val} className="badge bg-secondary d-flex align-items-center gap-1">
                    {label}
                    <i
                      className="bi bi-x ms-1"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => removeOption(val, e)}
                    ></i>
                  </div>
                );
              })
            )}
          </div>
          <div className="ms-2">
            <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-menu show w-100 p-2 shadow-sm" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {options.map((option) => {
              const isChecked = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleOptionClick(option)}
                >
                  <input type="checkbox" className="form-check-input me-2" checked={isChecked} readOnly />
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
