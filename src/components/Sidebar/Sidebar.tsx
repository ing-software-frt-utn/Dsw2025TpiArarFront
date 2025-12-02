import styles from "./Sidebar.module.css";
import Button from "../../modules/shared/components/Button";
interface Props {}
function Sidebar(props: Props) {
  return (
    <>
      <div className={styles.sideBar}>
        <img className={styles.logo} src="/plataformarar.png" alt="Logo ARAR" />
        <div className={styles.menu}>
          <span className={styles.subline}>Bienvenido</span>
          <Button label="Home" imgSrc={"dashboard-svgrepo-com.svg"} />
          <Button label="Juegos" imgSrc={"game-controller-svgrepo-com.svg"} />
        </div>
      </div>
    </>
  );
}
export default Sidebar;
