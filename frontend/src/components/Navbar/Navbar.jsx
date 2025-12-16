import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Home, BanknoteArrowUp, BookMarked  } from "lucide-react";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span>₿</span>
      </div>

      <div className={styles.menu}>
        <NavLink 
          to="/" 
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          <Home size={26} />
        </NavLink>

        <NavLink 
          to="/transaction" 
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          <BanknoteArrowUp size={26} />
        </NavLink>

        <NavLink 
          to="/news" 
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          <BookMarked  size={26} />
        </NavLink>
      </div>
    </nav>
  );
}
