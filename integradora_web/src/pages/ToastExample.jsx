import React, { useState } from "react"
import { Button, Toast, ToastContainer } from "react-bootstrap"

function ToastExample() {
  const [showToast, setShowToast] = useState(false)

  const handleShowToast = () => {
    setShowToast(true)
  }

  return (
    <div className="p-5">
      <Button onClick={handleShowToast}>Mostrar Toast</Button>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          bg="primary"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">
            🎉 ¡Hola, mundo! Este es un toast de ejemplo.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default ToastExample
