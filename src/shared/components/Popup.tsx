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
                <button 
                    onClick={onClose}
                    style={styles.button}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5b21b6'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'} 
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", 
        width: "100%", height: "100%", 
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 9999
    },
    popup: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        textAlign: "center",
        minWidth: "300px",
        maxWidth: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px" 
    },
    p: {
        fontSize: "24px", 
        margin: 0,
        color: "#333"
    },
    button: {
        backgroundColor: "#7c3aed", 
        color: "white",
        border: "none",
        padding: "10px 25px",
        fontSize: "20px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        fontWeight: "bold"
    }
};

export default ErrorPopup;