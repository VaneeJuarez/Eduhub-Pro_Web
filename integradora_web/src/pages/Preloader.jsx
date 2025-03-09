// Preloader.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/preloader.css";
import LogoSVG from "../components/LogoSVG"; // Este es el componente de tu logo, puedes reemplazarlo por el que uses

const Preloader = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        // Redirigimos al login después de que el preloader haya desaparecido
       // navigate("/login");
      }, 1000); // Redirigir después de 1 segundo
    }, 3000); // Mostrar preloader durante 3 segundos

    return () => clearTimeout(timer); // Limpiamos el timeout si el componente se desmonta
  }, [navigate]);

  return (
    <div id="preloader" className={fadeOut ? "fade-out" : ""}>
      <div className="preloader-logo">
        <LogoSVG />
      </div>
    </div>
  );
};

export default Preloader;
