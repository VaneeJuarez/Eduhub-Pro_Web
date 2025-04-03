import React, { useState } from "react";
import styles from "../../styles/support.module.css";

import { sendSupportMessage } from "../../api/instructor/intructor"; // Ajusta la ruta si es necesario
import { sweetAlert } from "../../utils/config/config"; // Tu alerta custom

const Support = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { success, error } = await sendSupportMessage(form.name, form.email, form.message);

    if (success) {
      sweetAlert("success", "Enviado", "Tu mensaje ha sido enviado correctamente.", "", null);
      setForm({ name: "", email: "", message: "" });
    } else {
      sweetAlert("error", "Error", error, "", null);
    }

    setLoading(false);
  };

  return (
    <section className={`${styles.section} ${styles.colored}`} id={styles.contactUs}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className={styles.centerHeading}>
              <h2 className={styles.sectionTitle}>Soporte Técnico</h2>
            </div>
          </div>
          <div className="offset-lg-3 col-lg-6">
            <div className={styles.centerText}>
              <p>
                Si tienes algún tipo de problema o duda sobre nuestra plataforma no dudes en contactar con nuestro soporte técnico.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h5 className="margin-bottom-30">Mantente en contacto</h5>
          </div>
          <div className="col-lg-7 col-md-6 col-sm-12">
            <div className={styles.contactForm}>
              <form className={styles.formSupport} id="contact" onSubmit={handleSubmit} method="get">
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <fieldset>
                      <input
                        name="name"
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nombre completo"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <fieldset>
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <textarea
                        name="message"
                        rows="6"
                        className="form-control"
                        id="message"
                        placeholder="Mensaje"
                        value={form.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button
                        type="submit"
                        className={styles.mainButton}
                        disabled={loading}
                      >
                        {loading ? "Enviando..." : "Enviar mensaje"}
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
