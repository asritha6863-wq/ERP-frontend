import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome to ERP System</h2>
                <p style={styles.subtitle}>Select your role to continue</p>
                <div style={styles.roleGrid}>
                    <div style={styles.roleCard} onClick={() => navigate("/admin-login")}>
                        <div style={styles.roleIcon}>🛡️</div>
                        <p style={styles.roleLabel}>Admin</p>
                        <p style={styles.roleDesc}>Manage users & system</p>
                    </div>
                    <div style={styles.roleCard} onClick={() => navigate("/employee-login")}>
                        <div style={styles.roleIcon}>👤</div>
                        <p style={styles.roleLabel}>Employee</p>
                        <p style={styles.roleDesc}>Submit purchase requests</p>
                    </div>
                    <div style={styles.roleCard} onClick={() => navigate("/department-login")}>
                        <div style={styles.roleIcon}>🏢</div>
                        <p style={styles.roleLabel}>Department</p>
                        <p style={styles.roleDesc}>Approve or reject requests</p>
                    </div>
                    <div style={styles.roleCard} onClick={() => navigate("/accounts-login")}>
                        <div style={styles.roleIcon}>💰</div>
                        <p style={styles.roleLabel}>Accounts</p>
                        <p style={styles.roleDesc}>Process approved requests</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f8" },
    card: { width: "500px", padding: "40px", background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center" },
    title: { fontSize: "24px", fontWeight: "bold", marginBottom: "8px", color: "#1a1a2e" },
    subtitle: { color: "#6b7280", marginBottom: "30px", fontSize: "14px" },
    roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    roleCard: { padding: "24px 12px", border: "2px solid #e5e7eb", borderRadius: "10px", cursor: "pointer", background: "#f9fafb" },
    roleIcon: { fontSize: "32px", marginBottom: "10px" },
    roleLabel: { fontWeight: "600", fontSize: "15px", color: "#1a1a2e", margin: "0 0 6px 0" },
    roleDesc: { fontSize: "11px", color: "#6b7280", margin: 0 }
};

export default Login;