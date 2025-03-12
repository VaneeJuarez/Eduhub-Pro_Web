// Img
import logo from '../assets/img/Logo.png'
import styles from '../styles/header.module.css'


const Header = ({userName}) => {

    return (
        <header className={`${styles.headerArea} ${styles.headerSticky}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className={styles.mainNav}>
              <a href="#" className={styles.logo}>
                <img src={logo} alt="EduHub Pro" style={{ height: "100%" }} />
              </a>
              <ul className={styles.nav}>
                <li>
                  <a className="active" style={{ gap: "5px", display: "flex", alignItems: "center" }}>
                    <i className="bi bi-person-fill"></i> <span>{userName}</span>
                  </a>
                </li>
              </ul>
              <a className={styles.menuTrigger}>
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
    );
}

export default Header;