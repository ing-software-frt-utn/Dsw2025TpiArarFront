import { Outlet } from "react-router-dom";
import styles from "./Base.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

function Base() {
  return (
    <>
      <div className={styles.layoutWrapper}>
        <Sidebar />
        <div className={styles.mainSection}>
          <Header />
          <div className={styles.pageContent}>{<Outlet />}</div>
        </div>
      </div>
    </>
  );
}

export default Base;
