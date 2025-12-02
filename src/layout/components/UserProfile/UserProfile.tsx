import styles from './UserProfile.module.css';

type Props = {
    name: string;
    imgSrc?: string;
    onClick?: () => void;
};

function UserProfile({ name, imgSrc, onClick }: Props) {
    return (
        <div className={styles.container} onClick={onClick}>
            {imgSrc && <img src={imgSrc} alt={`Foto de ${name}`} className={styles.avatar} />}
            <p className={styles.greeting}>Hola {name}</p>

        </div>
    );
}

export default UserProfile;