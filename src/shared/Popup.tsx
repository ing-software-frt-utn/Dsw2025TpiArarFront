import React from "react";

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <p style={styles.p}>{message}</p>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-40%, -50%)",
        width: "300px", height: "auto",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex", justifyContent: "center", alignItems: "center"
    },
    popup: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        textAlign: "center",
        minWidth: "300px",
        fontSize: "30px",
    },

    p: {
        fontSize: "30px",
    }

};

export default ErrorPopup;
