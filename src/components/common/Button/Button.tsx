import styles from './Button.module.css';
type Props = {
    label: string
    imgSrc?: string;
    onClick?: () => void;
}

function Button({ label, imgSrc, onClick }: Props) {
    return (<>
        {imgSrc ? (
            <div className={styles.iconContainer}>
                <button className={styles.buttonOne} onClick={onClick}
                >
                    <img src={imgSrc} className={styles.icon} alt="Icono del botón" />
                    {label}

                </button>
            </div>
        ) : (
            <button className={styles.buttonOne} onClick={onClick}
            >
                {label}
            </button>
        )}

    </>)
} export default Button;