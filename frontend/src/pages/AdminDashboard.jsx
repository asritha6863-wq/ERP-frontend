import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {

    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("dashboard");

    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee"
    });

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    // ================= FETCH USERS =================

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const fetchUsers = async () => {
        try {

            const res = await axios.get(
                "http://localhost:5000/api/auth/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    // ================= REGISTER USER =================

    const handleRegister = async () => {

        if (!form.name || !form.email || !form.password) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        try {

            await axios.post(
                "http://localhost:5000/api/auth/register",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                `✅ ${form.role.charAt(0).toUpperCase() + form.role.slice(1)} added successfully`
            );

            setForm({
                name: "",
                email: "",
                password: "",
                role: "employee"
            });

            await fetchUsers();

            setActiveMenu("dashboard");

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message || "Registration failed"
            );

        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE USER =================

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this user?")) return;

        try {

            await axios.delete(
                `http://localhost:5000/api/auth/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("✅ User deleted");

            fetchUsers();

        } catch (err) {

            console.log(err);

            alert("Delete failed");
        }
    };

    // ================= LOGOUT =================

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // ================= COUNTS =================

    const employees = users.filter(
        (u) => u.role?.toLowerCase() === "employee"
    );

    const departments = users.filter(
        (u) => u.role?.toLowerCase() === "department"
    );

    const accounts = users.filter(
        (u) => u.role?.toLowerCase() === "accounts"
    );

    // ================= ROLE BADGE =================

    const getRoleBadge = (role) => {

        const map = {
            employee: {
                bg: "#dbeafe",
                color: "#2563eb"
            },
            department: {
                bg: "#d1fae5",
                color: "#059669"
            },
            accounts: {
                bg: "#fef9c3",
                color: "#ca8a04"
            },
            admin: {
                bg: "#ede9fe",
                color: "#7c3aed"
            }
        };

        return map[role] || {
            bg: "#f3f4f6",
            color: "#374151"
        };
    };

    return (

        <div style={styles.wrapper}>

            {/* ================= SIDEBAR ================= */}

            <div style={styles.sidebar}>

                <div style={styles.sidebarLogo}>
                    <span>⚙️</span>
                    <span style={styles.logoText}>
                        ERP Admin
                    </span>
                </div>

                <div style={styles.sidebarUser}>

                    <div style={styles.avatar}>
                        A
                    </div>

                    <div>
                        <p style={styles.userName}>
                            Admin
                        </p>

                        <p style={styles.userRole}>
                            Super Admin
                        </p>
                    </div>

                </div>

                {[
                    {
                        id: "dashboard",
                        icon: "🏠",
                        label: "Dashboard"
                    },
                    {
                        id: "adduser",
                        icon: "➕",
                        label: "Add User"
                    },
                    {
                        id: "users",
                        icon: "👥",
                        label: "All Users"
                    }
                ].map((item) => (

                    <div
                        key={item.id}
                        style={{
                            ...styles.menuItem,
                            background:
                                activeMenu === item.id
                                    ? "#7c3aed"
                                    : "transparent",

                            color:
                                activeMenu === item.id
                                    ? "#fff"
                                    : "#94a3b8"
                        }}
                        onClick={() => {
                            setActiveMenu(item.id);
                            fetchUsers();
                        }}
                    >

                        <span>{item.icon}</span>
                        <span>{item.label}</span>

                    </div>
                ))}

                <div
                    style={styles.logoutBtn}
                    onClick={handleLogout}
                >
                    🚪 Logout
                </div>

            </div>

            {/* ================= MAIN ================= */}

            <div style={styles.main}>

                <div style={styles.header}>

                    <h2 style={styles.headerTitle}>

                        {activeMenu === "dashboard" &&
                            "Admin Dashboard"}

                        {activeMenu === "adduser" &&
                            "Add New User"}

                        {activeMenu === "users" &&
                            "All Users"}

                    </h2>

                </div>

                {/* ================= DASHBOARD ================= */}

                {activeMenu === "dashboard" && (

                    <div>

                        {/* ===== STAT CARDS ===== */}

                        <div style={styles.statsRow}>

                            {[
                                {
                                    label: "Total Users",
                                    value: users.length,
                                    color: "#7c3aed",
                                    icon: "👥"
                                },
                                {
                                    label: "Employees",
                                    value: employees.length,
                                    color: "#2563eb",
                                    icon: "👤"
                                },
                                {
                                    label: "Departments",
                                    value: departments.length,
                                    color: "#059669",
                                    icon: "🏢"
                                },
                                {
                                    label: "Accounts",
                                    value: accounts.length,
                                    color: "#ca8a04",
                                    icon: "💰"
                                }
                            ].map((stat, i) => (

                                <div
                                    key={i}
                                    style={styles.statCard}
                                >

                                    <div style={{ fontSize: "28px" }}>
                                        {stat.icon}
                                    </div>

                                    <p
                                        style={{
                                            ...styles.statValue,
                                            color: stat.color
                                        }}
                                    >
                                        {stat.value}
                                    </p>

                                    <p style={styles.statLabel}>
                                        {stat.label}
                                    </p>

                                </div>
                            ))}

                        </div>

                        {/* ===== QUICK ACTIONS ===== */}

                        <div style={styles.quickActions}>

                            <h3 style={styles.sectionTitle}>
                                Quick Actions
                            </h3>

                            <div style={styles.actionRow}>

                                <button
                                    style={{
                                        ...styles.actionBtn,
                                        background: "#2563eb"
                                    }}
                                    onClick={() => {
                                        setForm({
                                            ...form,
                                            role: "employee"
                                        });

                                        setActiveMenu("adduser");
                                    }}
                                >
                                    👤 Add Employee
                                </button>

                                <button
                                    style={{
                                        ...styles.actionBtn,
                                        background: "#059669"
                                    }}
                                    onClick={() => {
                                        setForm({
                                            ...form,
                                            role: "department"
                                        });

                                        setActiveMenu("adduser");
                                    }}
                                >
                                    🏢 Add Department
                                </button>

                                <button
                                    style={{
                                        ...styles.actionBtn,
                                        background: "#ca8a04"
                                    }}
                                    onClick={() => {
                                        setForm({
                                            ...form,
                                            role: "accounts"
                                        });

                                        setActiveMenu("adduser");
                                    }}
                                >
                                    💰 Add Accounts
                                </button>

                                <button
                                    style={{
                                        ...styles.actionBtn,
                                        background: "#7c3aed"
                                    }}
                                    onClick={() =>
                                        setActiveMenu("users")
                                    }
                                >
                                    👥 View All Users
                                </button>

                            </div>

                        </div>

                        {/* ===== RECENT USERS ===== */}

                        <div style={styles.tableCard}>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "16px"
                                }}
                            >

                                <h3
                                    style={{
                                        ...styles.sectionTitle,
                                        marginBottom: 0
                                    }}
                                >
                                    Recent Users
                                </h3>

                                <button
                                    style={styles.refreshBtn}
                                    onClick={fetchUsers}
                                >
                                    🔄 Refresh
                                </button>

                            </div>

                            <table style={styles.table}>

                                <thead>

                                    <tr style={styles.tableHead}>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Email</th>
                                        <th style={styles.th}>Role</th>
                                        <th style={styles.th}>Created</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {users.slice(0, 5).map((u, i) => (

                                        <tr
                                            key={i}
                                            style={styles.tableRow}
                                        >

                                            <td style={styles.td}>
                                                {u.name}
                                            </td>

                                            <td style={styles.td}>
                                                {u.email}
                                            </td>

                                            <td style={styles.td}>

                                                <span
                                                    style={{
                                                        ...styles.badge,
                                                        background:
                                                            getRoleBadge(
                                                                u.role
                                                            ).bg,
                                                        color:
                                                            getRoleBadge(
                                                                u.role
                                                            ).color
                                                    }}
                                                >
                                                    {u.role}
                                                </span>

                                            </td>

                                            <td style={styles.td}>
                                                {new Date(
                                                    u.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

                {/* ================= ADD USER ================= */}

                {activeMenu === "adduser" && (

                    <div style={styles.formCard}>

                        <h3 style={styles.sectionTitle}>
                            ➕ Add New User
                        </h3>

                        <div style={styles.formGrid}>

                            <div style={styles.formGroup}>

                                <label style={styles.label}>
                                    Full Name
                                </label>

                                <input
                                    style={styles.input}
                                    placeholder="Enter full name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div style={styles.formGroup}>

                                <label style={styles.label}>
                                    Email
                                </label>

                                <input
                                    style={styles.input}
                                    type="email"
                                    placeholder="Enter email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div style={styles.formGroup}>

                                <label style={styles.label}>
                                    Password
                                </label>

                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div style={styles.formGroup}>

                                <label style={styles.label}>
                                    Role
                                </label>

                                <select
                                    style={styles.input}
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            role: e.target.value
                                        })
                                    }
                                >

                                    <option value="employee">
                                        Employee
                                    </option>

                                    <option value="department">
                                        Department
                                    </option>

                                    <option value="accounts">
                                        Accounts
                                    </option>

                                </select>

                            </div>

                        </div>

                        <button
                            style={styles.submitBtn}
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading
                                ? "Adding..."
                                : "Add User"}
                        </button>

                    </div>
                )}

                {/* ================= USERS TABLE ================= */}

                {activeMenu === "users" && (

                    <div style={styles.tableCard}>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px"
                            }}
                        >

                            <h3
                                style={{
                                    ...styles.sectionTitle,
                                    marginBottom: 0
                                }}
                            >
                                👥 All Users
                            </h3>

                            <button
                                style={styles.refreshBtn}
                                onClick={fetchUsers}
                            >
                                🔄 Refresh
                            </button>

                        </div>

                        <table style={styles.table}>

                            <thead>

                                <tr style={styles.tableHead}>

                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Created</th>
                                    <th style={styles.th}>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {users.map((u, i) => (

                                    <tr
                                        key={i}
                                        style={styles.tableRow}
                                    >

                                        <td style={styles.td}>
                                            {i + 1}
                                        </td>

                                        <td style={styles.td}>
                                            {u.name}
                                        </td>

                                        <td style={styles.td}>
                                            {u.email}
                                        </td>

                                        <td style={styles.td}>

                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    background:
                                                        getRoleBadge(
                                                            u.role
                                                        ).bg,
                                                    color:
                                                        getRoleBadge(
                                                            u.role
                                                        ).color
                                                }}
                                            >
                                                {u.role}
                                            </span>

                                        </td>

                                        <td style={styles.td}>
                                            {new Date(
                                                u.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td style={styles.td}>

                                            {u.role !== "admin" && (

                                                <button
                                                    style={styles.deleteBtn}
                                                    onClick={() =>
                                                        handleDelete(
                                                            u._id
                                                        )
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>

                                            )}

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

// ================= STYLES =================

const styles = {

    wrapper: {
        display: "flex",
        height: "100vh",
        background: "#f1f5f9",
        fontFamily: "sans-serif"
    },

    sidebar: {
        width: "220px",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        gap: "4px"
    },

    sidebarLogo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 20px 20px",
        borderBottom: "1px solid #1e293b"
    },

    logoText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: "16px"
    },

    sidebarUser: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "16px 20px",
        borderBottom: "1px solid #1e293b"
    },

    avatar: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "#7c3aed",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700"
    },

    userName: {
        color: "#fff",
        margin: 0,
        fontWeight: "600"
    },

    userRole: {
        color: "#94a3b8",
        margin: 0,
        fontSize: "12px"
    },

    menuItem: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 20px",
        cursor: "pointer",
        borderRadius: "6px",
        margin: "0 8px"
    },

    logoutBtn: {
        marginTop: "auto",
        padding: "12px 20px",
        color: "#ef4444",
        cursor: "pointer"
    },

    main: {
        flex: 1,
        overflow: "auto",
        padding: "24px"
    },

    header: {
        marginBottom: "20px"
    },

    headerTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "700"
    },

    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "16px",
        marginBottom: "20px"
    },

    statCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    },

    statValue: {
        fontSize: "28px",
        fontWeight: "700",
        margin: "10px 0 5px"
    },

    statLabel: {
        margin: 0,
        color: "#64748b"
    },

    quickActions: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    },

    actionRow: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "12px"
    },

    actionBtn: {
        padding: "10px 18px",
        border: "none",
        color: "#fff",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    tableCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "16px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    tableHead: {
        background: "#f8fafc"
    },

    th: {
        padding: "12px",
        textAlign: "left",
        fontSize: "13px",
        borderBottom: "1px solid #e5e7eb"
    },

    tableRow: {
        borderBottom: "1px solid #f1f5f9"
    },

    td: {
        padding: "12px",
        fontSize: "14px"
    },

    badge: {
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },

    formCard: {
        background: "#fff",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "20px"
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    label: {
        fontSize: "13px",
        fontWeight: "600"
    },

    input: {
        padding: "10px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        outline: "none"
    },

    submitBtn: {
        padding: "11px 28px",
        background: "#7c3aed",
        color: "#fff",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    deleteBtn: {
        padding: "5px 10px",
        background: "#fee2e2",
        color: "#dc2626",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    refreshBtn: {
        padding: "7px 14px",
        background: "#7c3aed",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default AdminDashboard;