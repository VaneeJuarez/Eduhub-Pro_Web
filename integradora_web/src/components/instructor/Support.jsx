import React from "react";
import styles from "../../styles/support.module.css";

const Support = () => {
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
              <form className={styles.formSupport} id="contact" action="" method="get">
                <div className="row">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <fieldset>
                      <input
                        name="name"
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nombre completo"
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
                        required
                      ></textarea>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" id="form-submit" className={styles.mainButton}>
                        Enviar mensaje
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
