import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DepartmentLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            // ✅ Check role
            if (res.data.role !== "department") {
                alert("Access denied. Not a department account.");
                return;
            }

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("user", JSON.stringify(res.data));

            navigate("/department");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconBox}>🏢</div>
                <h2 style={styles.title}>Department Login</h2>
                <p style={styles.subtitle}>Enter your credentials to continue</p>

                <input
                    style={styles.input}
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                    onClick={login}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p
                    style={styles.backLink}
                    onClick={() => navigate("/")}
                >
                    ← Back to Role Selection
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
    },
    card: {
        width: "340px",
        padding: "36px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        textAlign: "center"
    },
    iconBox: {
        fontSize: "40px"
    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#1a1a2e",
        margin: 0
    },
    subtitle: {
        fontSize: "13px",
        color: "#6b7280",
        margin: 0
    },
    input: {
        padding: "11px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "14px",
        outline: "none"
    },
    button: {
        padding: "11px",
        background: "#059669",
        color: "white",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600"
    },
    backLink: {
        fontSize: "13px",
        color: "#6b7280",
        cursor: "pointer",
        margin: 0
    }
};

export default DepartmentLogin;