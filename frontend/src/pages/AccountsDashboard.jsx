import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AccountsDashboard() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [requests, setRequests] = useState([]);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/requests/accounts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/requests/accounts/update/${id}`,
                { accountsStatus: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchRequests();
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const pending = requests.filter(r => r.accountsStatus === "Pending");
    const processing = requests.filter(r => r.accountsStatus === "Processing");
    const completed = requests.filter(r => r.accountsStatus === "Completed");

    return (
        <div style={styles.wrapper}>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <span>💰</span>
                    <span style={styles.logoText}>Accounts</span>
                </div>
                <div style={styles.sidebarUser}>
                    <div style={styles.avatar}>
                        {user.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                        <p style={styles.userName}>{user.name || "Accounts"}</p>
                        <p style={styles.userRole}>Accounts Dept</p>
                    </div>
                </div>

                {[
                    { id: "dashboard", icon: "🏠", label: "Dashboard" },
                    { id: "pending", icon: "⏳", label: `Pending (${pending.length})` },
                    { id: "processing", icon: "🔄", label: `Processing (${processing.length})` },
                    { id: "completed", icon: "✅", label: `Completed (${completed.length})` },
                ].map(item => (
                    <div
                        key={item.id}
                        style={{
                            ...styles.menuItem,
                            background: activeMenu === item.id ? "#2563eb" : "transparent",
                            color: activeMenu === item.id ? "#fff" : "#94a3b8"
                        }}
                        onClick={() => setActiveMenu(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}

                <div style={styles.logoutBtn} onClick={handleLogout}>
                    🚪 Logout
                </div>
            </div>

            {/* Main */}
            <div style={styles.main}>
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>
                        {activeMenu === "dashboard" && "Accounts Dashboard"}
                        {activeMenu === "pending" && "Pending Requests"}
                        {activeMenu === "processing" && "Processing Requests"}
                        {activeMenu === "completed" && "Completed Requests"}
                    </h2>
                    <p style={styles.headerSub}>Welcome, {user.name || "Accounts"} 👋</p>
                </div>

                {/* Dashboard Stats */}
                {activeMenu === "dashboard" && (
                    <div>
                        <div style={styles.statsRow}>
                            {[
                                { label: "Total Received", value: requests.length, color: "#2563eb", icon: "📋" },
                                { label: "Pending", value: pending.length, color: "#d97706", icon: "⏳" },
                                { label: "Processing", value: processing.length, color: "#7c3aed", icon: "🔄" },
                                { label: "Completed", value: completed.length, color: "#16a34a", icon: "✅" },
                            ].map((stat, i) => (
                                <div key={i} style={styles.statCard}>
                                    <div style={{ fontSize: "28px" }}>{stat.icon}</div>
                                    <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
                                    <p style={styles.statLabel}>{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* All requests table */}
                        <div style={styles.tableCard}>
                            <h3 style={styles.sectionTitle}>📋 All Approved Requests</h3>
                            {requests.length === 0 ? (
                                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                                    No requests received yet
                                </p>
                            ) : (
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.tableHead}>
                                            <th style={styles.th}>#</th>
                                            <th style={styles.th}>Employee</th>
                                            <th style={styles.th}>Item</th>
                                            <th style={styles.th}>Qty</th>
                                            <th style={styles.th}>Approved By</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((req, i) => (
                                            <tr key={i} style={styles.tableRow}>
                                                <td style={styles.td}>{i + 1}</td>
                                                <td style={styles.td}>{req.employeeId?.name}</td>
                                                <td style={styles.td}>{req.itemName}</td>
                                                <td style={styles.td}>{req.quantity}</td>
                                                <td style={styles.td}>{req.approvedBy}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: req.accountsStatus === "Completed" ? "#d1fae5" : req.accountsStatus === "Processing" ? "#ede9fe" : "#dbeafe",
                                                        color: req.accountsStatus === "Completed" ? "#059669" : req.accountsStatus === "Processing" ? "#7c3aed" : "#2563eb"
                                                    }}>
                                                        {req.accountsStatus}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <select
                                                        style={styles.select}
                                                        value={req.accountsStatus}
                                                        onChange={(e) => updateStatus(req._id, e.target.value)}
                                                    >
                                                        <option>Pending</option>
                                                        <option>Processing</option>
                                                        <option>Completed</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Pending Tab */}
                {activeMenu === "pending" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>⏳ Pending Requests</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Employee</th>
                                    <th style={styles.th}>Item</th>
                                    <th style={styles.th}>Qty</th>
                                    <th style={styles.th}>Approved By</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map((req, i) => (
                                    <tr key={i} style={styles.tableRow}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>{req.employeeId?.name}</td>
                                        <td style={styles.td}>{req.itemName}</td>
                                        <td style={styles.td}>{req.quantity}</td>
                                        <td style={styles.td}>{req.approvedBy}</td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.processBtn}
                                                onClick={() => updateStatus(req._id, "Processing")}
                                            >
                                                🔄 Start Processing
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Processing Tab */}
                {activeMenu === "processing" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>🔄 Processing Requests</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Employee</th>
                                    <th style={styles.th}>Item</th>
                                    <th style={styles.th}>Qty</th>
                                    <th style={styles.th}>Approved By</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processing.map((req, i) => (
                                    <tr key={i} style={styles.tableRow}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>{req.employeeId?.name}</td>
                                        <td style={styles.td}>{req.itemName}</td>
                                        <td style={styles.td}>{req.quantity}</td>
                                        <td style={styles.td}>{req.approvedBy}</td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.completeBtn}
                                                onClick={() => updateStatus(req._id, "Completed")}
                                            >
                                                ✅ Mark Complete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Completed Tab */}
                {activeMenu === "completed" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>✅ Completed Requests</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Employee</th>
                                    <th style={styles.th}>Item</th>
                                    <th style={styles.th}>Qty</th>
                                    <th style={styles.th}>Approved By</th>
                                    <th style={styles.th}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completed.map((req, i) => (
                                    <tr key={i} style={styles.tableRow}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>{req.employeeId?.name}</td>
                                        <td style={styles.td}>{req.itemName}</td>
                                        <td style={styles.td}>{req.quantity}</td>
                                        <td style={styles.td}>{req.approvedBy}</td>
                                        <td style={styles.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
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

const styles = {
    wrapper: { display: "flex", height: "100vh", background: "#f1f5f9", fontFamily: "sans-serif" },
    sidebar: { width: "220px", background: "#0f172a", display: "flex", flexDirection: "column", padding: "20px 0", gap: "4px", flexShrink: 0 },
    sidebarLogo: { display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 20px 20px", borderBottom: "1px solid #1e293b" },
    logoText: { color: "#fff", fontWeight: "700", fontSize: "16px" },
    sidebarUser: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px", borderBottom: "1px solid #1e293b", marginBottom: "8px" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
    userName: { color: "#fff", fontSize: "13px", fontWeight: "600", margin: 0 },
    userRole: { color: "#64748b", fontSize: "11px", margin: 0 },
    menuItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", cursor: "pointer", borderRadius: "6px", margin: "0 8px", fontSize: "14px" },
    logoutBtn: { marginTop: "auto", padding: "10px 20px", color: "#ef4444", cursor: "pointer", fontSize: "14px" },
    main: { flex: 1, overflow: "auto", padding: "24px" },
    header: { marginBottom: "24px" },
    headerTitle: { fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 },
    headerSub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0 0" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" },
    statCard: { background: "#fff", borderRadius: "10px", padding: "20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    statValue: { fontSize: "28px", fontWeight: "700", margin: "8px 0 4px 0" },
    statLabel: { color: "#6b7280", fontSize: "13px", margin: 0 },
    tableCard: { background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    sectionTitle: { fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "16px", marginTop: 0 },
    table: { width: "100%", borderCollapse: "collapse" },
    tableHead: { background: "#f8fafc" },
    th: { padding: "10px 12px", textAlign: "left", fontSize: "12px", color: "#64748b", fontWeight: "600", borderBottom: "1px solid #e5e7eb" },
    tableRow: { borderBottom: "1px solid #f1f5f9" },
    td: { padding: "10px 12px", fontSize: "13px", color: "#374151" },
    badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" },
    select: { padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "12px", cursor: "pointer" },
    processBtn: { padding: "5px 10px", background: "#ede9fe", color: "#7c3aed", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
    completeBtn: { padding: "5px 10px", background: "#d1fae5", color: "#059669", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }
};

export default AccountsDashboard;