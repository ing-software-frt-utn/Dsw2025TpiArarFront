import UserProfile from '../UserProfile/UserProfile';
import styles from './Header.module.css';
function Header() {
    return (<>
        <div className={styles.header}>
            <UserProfile name="Mariano" imgSrc="/avatar.png" />
        </div>

    </>)
}
export default Header;