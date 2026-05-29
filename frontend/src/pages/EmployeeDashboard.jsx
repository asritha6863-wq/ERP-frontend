import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({
        itemName: "",
        quantity: "",
        reason: "",
        priority: "Medium",
        department: ""
    });
    const [stats, setStats] = useState({
        total: 0, pending: 0, approved: 0, rejected: 0
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/requests/my", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);

            // Calculate stats
            const total = res.data.length;
            const pending = res.data.filter(r => r.status === "Pending").length;
            const approved = res.data.filter(r => r.status === "Approved").length;
            const rejected = res.data.filter(r => r.status === "Rejected").length;
            setStats({ total, pending, approved, rejected });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!form.itemName || !form.quantity || !form.reason) {
            alert("Please fill all fields");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/requests/create", form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Request submitted!");
            setForm({ itemName: "", quantity: "", reason: "", priority: "Medium", department: "" });
            fetchRequests();
            setActiveMenu("requests");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const getStatusColor = (status) => {
        if (status === "Approved") return "#16a34a";
        if (status === "Rejected") return "#dc2626";
        return "#d97706";
    };

    const getPriorityColor = (priority) => {
        if (priority === "High") return "#dc2626";
        if (priority === "Medium") return "#d97706";
        return "#16a34a";
    };

    return (
        <div style={styles.wrapper}>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <span style={{ fontSize: "20px" }}>⚙️</span>
                    <span style={styles.logoText}>ERP System</span>
                </div>

                <div style={styles.sidebarUser}>
                    <div style={styles.avatar}>
                        {user.name?.charAt(0).toUpperCase() || "E"}
                    </div>
                    <div>
                        <p style={styles.userName}>{user.name || "Employee"}</p>
                        <p style={styles.userRole}>Employee</p>
                    </div>
                </div>

                {[
                    { id: "dashboard", icon: "🏠", label: "Dashboard" },
                    { id: "newrequest", icon: "➕", label: "New Request" },
                    { id: "requests", icon: "📄", label: "My Requests" },
                    { id: "status", icon: "📊", label: "Status Tracker" },
                ].map(item => (
                    <div
                        key={item.id}
                        style={{
                            ...styles.menuItem,
                            background: activeMenu === item.id ? "#3b82f6" : "transparent",
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

            {/* Main Content */}
            <div style={styles.main}>

                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>
                        {activeMenu === "dashboard" && "Employee Dashboard"}
                        {activeMenu === "newrequest" && "New Purchase Request"}
                        {activeMenu === "requests" && "My Requests"}
                        {activeMenu === "status" && "Status Tracker"}
                    </h2>
                    <p style={styles.headerSub}>
                        Welcome back, {user.name || "Employee"} 👋
                    </p>
                </div>

                {/* Dashboard View */}
                {activeMenu === "dashboard" && (
                    <div>
                        {/* Stats Cards */}
                        <div style={styles.statsRow}>
                            {[
                                { label: "Total Requests", value: stats.total, color: "#3b82f6", icon: "📋" },
                                { label: "Pending", value: stats.pending, color: "#d97706", icon: "⏳" },
                                { label: "Approved", value: stats.approved, color: "#16a34a", icon: "✅" },
                                { label: "Rejected", value: stats.rejected, color: "#dc2626", icon: "❌" }
                            ].map((stat, i) => (
                                <div key={i} style={styles.statCard}>
                                    <div style={{ fontSize: "28px" }}>{stat.icon}</div>
                                    <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
                                    <p style={styles.statLabel}>{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Status Flow */}
                        <div style={styles.flowCard}>
                            <h3 style={styles.sectionTitle}>📊 Request Flow</h3>
                            <div style={styles.flowRow}>
                                {["Submitted", "Dept Review", "Finance", "Purchase", "Completed"].map((step, i, arr) => (
                                    <div key={i} style={styles.flowStep}>
                                        <div style={styles.flowDot}>{i + 1}</div>
                                        <p style={styles.flowLabel}>{step}</p>
                                        {i < arr.length - 1 && <div style={styles.flowArrow}>→</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Requests */}
                        <div style={styles.tableCard}>
                            <h3 style={styles.sectionTitle}>📋 Recent Requests</h3>
                            {requests.length === 0 ? (
                                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                                    No requests yet. Create your first request!
                                </p>
                            ) : (
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.tableHead}>
                                            <th style={styles.th}>Item</th>
                                            <th style={styles.th}>Qty</th>
                                            <th style={styles.th}>Priority</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.slice(0, 5).map((req, i) => (
                                            <tr key={i} style={styles.tableRow}>
                                                <td style={styles.td}>{req.itemName}</td>
                                                <td style={styles.td}>{req.quantity}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: getPriorityColor(req.priority) + "20",
                                                        color: getPriorityColor(req.priority)
                                                    }}>
                                                        {req.priority}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.badge,
                                                        background: getStatusColor(req.status) + "20",
                                                        color: getStatusColor(req.status)
                                                    }}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* New Request Form */}
                {activeMenu === "newrequest" && (
                    <div style={styles.formCard}>
                        <h3 style={styles.sectionTitle}>➕ Create Purchase Request</h3>

                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Item Name *</label>
                                <input
                                    style={styles.input}
                                    placeholder="e.g. Laptop, Chair"
                                    value={form.itemName}
                                    onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Quantity *</label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    placeholder="e.g. 2"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Department</label>
                                <input
                                    style={styles.input}
                                    placeholder="e.g. IT, HR, Admin"
                                    value={form.department}
                                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Priority</label>
                                <select
                                    style={styles.input}
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                                <label style={styles.label}>Reason *</label>
                                <textarea
                                    style={{ ...styles.input, height: "80px", resize: "vertical" }}
                                    placeholder="Why do you need this item?"
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                />
                            </div>
                        </div>

                        <button style={styles.submitBtn} onClick={handleSubmit}>
                            Submit Request
                        </button>
                    </div>
                )}

                {/* My Requests Table */}
                {activeMenu === "requests" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>📄 My Requests</h3>
                        {requests.length === 0 ? (
                            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                                No requests found.
                            </p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHead}>
                                        <th style={styles.th}>#</th>
                                        <th style={styles.th}>Item</th>
                                        <th style={styles.th}>Qty</th>
                                        <th style={styles.th}>Department</th>
                                        <th style={styles.th}>Priority</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req, i) => (
                                        <tr key={i} style={styles.tableRow}>
                                            <td style={styles.td}>{i + 1}</td>
                                            <td style={styles.td}>{req.itemName}</td>
                                            <td style={styles.td}>{req.quantity}</td>
                                            <td style={styles.td}>{req.department || "-"}</td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.badge,
                                                    background: getPriorityColor(req.priority) + "20",
                                                    color: getPriorityColor(req.priority)
                                                }}>
                                                    {req.priority}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.badge,
                                                    background: getStatusColor(req.status) + "20",
                                                    color: getStatusColor(req.status)
                                                }}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Status Tracker */}
                {activeMenu === "status" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>📊 Status Tracker</h3>
                        {requests.map((req, i) => (
                            <div key={i} style={styles.trackerCard}>
                                <div style={styles.trackerHeader}>
                                    <span style={styles.trackerItem}>{req.itemName}</span>
                                    <span style={{
                                        ...styles.badge,
                                        background: getStatusColor(req.status) + "20",
                                        color: getStatusColor(req.status)
                                    }}>
                                        {req.status}
                                    </span>
                                </div>
                                <div style={styles.trackerFlow}>
                                    {["Submitted", "Dept Review", "Finance", "Purchase", "Completed"].map((step, j) => {
                                        const stepIndex = req.status === "Approved" ? 4
                                            : req.status === "Rejected" ? 1
                                            : 1;
                                        return (
                                            <div key={j} style={styles.trackerStep}>
                                                <div style={{
                                                    ...styles.trackerDot,
                                                    background: j <= stepIndex ? "#3b82f6" : "#e5e7eb"
                                                }} />
                                                <p style={{
                                                    ...styles.trackerLabel,
                                                    color: j <= stepIndex ? "#3b82f6" : "#9ca3af"
                                                }}>
                                                    {step}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
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
    avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
    userName: { color: "#fff", fontSize: "13px", fontWeight: "600", margin: 0 },
    userRole: { color: "#64748b", fontSize: "11px", margin: 0 },
    menuItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", cursor: "pointer", borderRadius: "6px", margin: "0 8px", fontSize: "14px", transition: "all 0.2s" },
    logoutBtn: { marginTop: "auto", padding: "10px 20px", color: "#ef4444", cursor: "pointer", fontSize: "14px" },
    main: { flex: 1, overflow: "auto", padding: "24px" },
    header: { marginBottom: "24px" },
    headerTitle: { fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 },
    headerSub: { color: "#64748b", fontSize: "14px", margin: "4px 0 0 0" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" },
    statCard: { background: "#fff", borderRadius: "10px", padding: "20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    statValue: { fontSize: "28px", fontWeight: "700", margin: "8px 0 4px 0" },
    statLabel: { color: "#6b7280", fontSize: "13px", margin: 0 },
    flowCard: { background: "#fff", borderRadius: "10px", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    flowRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", flexWrap: "wrap" },
    flowStep: { display: "flex", alignItems: "center", gap: "6px" },
    flowDot: { width: "28px", height: "28px", borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" },
    flowLabel: { fontSize: "12px", color: "#374151", margin: 0 },
    flowArrow: { color: "#94a3b8", fontSize: "16px" },
    tableCard: { background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    sectionTitle: { fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "16px", marginTop: 0 },
    table: { width: "100%", borderCollapse: "collapse" },
    tableHead: { background: "#f8fafc" },
    th: { padding: "10px 12px", textAlign: "left", fontSize: "12px", color: "#64748b", fontWeight: "600", borderBottom: "1px solid #e5e7eb" },
    tableRow: { borderBottom: "1px solid #f1f5f9" },
    td: { padding: "10px 12px", fontSize: "13px", color: "#374151" },
    badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" },
    formCard: { background: "#fff", borderRadius: "10px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", fontWeight: "500", color: "#374151" },
    input: { padding: "10px", border: "1px solid #d1d5db", borderRadius: "7px", fontSize: "14px", outline: "none" },
    submitBtn: { padding: "11px 28px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
    trackerCard: { background: "#f8fafc", borderRadius: "8px", padding: "16px", marginBottom: "12px", border: "1px solid #e5e7eb" },
    trackerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    trackerItem: { fontWeight: "600", color: "#0f172a", fontSize: "14px" },
    trackerFlow: { display: "flex", gap: "0", alignItems: "flex-start" },
    trackerStep: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1 },
    trackerDot: { width: "12px", height: "12px", borderRadius: "50%", marginBottom: "4px" },
    trackerLabel: { fontSize: "10px", textAlign: "center" }
};

export default EmployeeDashboard;