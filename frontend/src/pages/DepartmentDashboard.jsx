import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DepartmentDashboard() {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [requests, setRequests] = useState([]);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/requests/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async (req) => {
        if (!window.confirm(`Approve request for "${req.itemName}"?`)) return;
        try {
            await axios.put(`http://localhost:5000/api/requests/update/${req._id}`, {
                status: "Approved",
                approvedBy: user.name || "Department"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Approved and sent to Accounts!");
            await fetchRequests();
        } catch (err) {
            alert("Failed to approve");
        }
    };

    const handleReject = async () => {
        if (!rejectReason) {
            alert("Please select rejection reason");
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/requests/update/${rejectModal._id}`, {
                status: "Rejected",
                rejectionReason: rejectReason,
                approvedBy: user.name || "Department"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("❌ Request rejected!");
            setRejectModal(null);
            setRejectReason("");
            await fetchRequests();
        } catch (err) {
            alert("Failed to reject");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const pending = requests.filter(r => r.status === "Pending");
    const approved = requests.filter(r => r.status === "Sent to Accounts");
    const rejected = requests.filter(r => r.status === "Rejected");

    const getPriorityColor = (p) => p === "High" ? "#dc2626" : p === "Medium" ? "#d97706" : "#16a34a";

    return (
        <div style={styles.wrapper}>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>
                    <span>⚙️</span>
                    <span style={styles.logoText}>ERP System</span>
                </div>
                <div style={styles.sidebarUser}>
                    <div style={styles.avatar}>
                        {user.name?.charAt(0).toUpperCase() || "D"}
                    </div>
                    <div>
                        <p style={styles.userName}>{user.name || "Department"}</p>
                        <p style={styles.userRole}>Department</p>
                    </div>
                </div>

                {[
                    { id: "dashboard", icon: "🏠", label: "Dashboard" },
                    { id: "incoming", icon: "📥", label: `Incoming (${pending.length})` },
                    { id: "approved", icon: "✅", label: "Approved" },
                    { id: "rejected", icon: "❌", label: "Rejected" },
                ].map(item => (
                    <div
                        key={item.id}
                        style={{
                            ...styles.menuItem,
                            background: activeMenu === item.id ? "#059669" : "transparent",
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
                        {activeMenu === "dashboard" && "Department Dashboard"}
                        {activeMenu === "incoming" && "Incoming Requests"}
                        {activeMenu === "approved" && "Approved Requests"}
                        {activeMenu === "rejected" && "Rejected Requests"}
                    </h2>
                    <p style={styles.headerSub}>Welcome, {user.name || "Department"} 👋</p>
                </div>

                {/* Dashboard */}
                {activeMenu === "dashboard" && (
                    <div>
                        <div style={styles.statsRow}>
                            {[
                                { label: "Total", value: requests.length, color: "#2563eb", icon: "📋" },
                                { label: "Pending", value: pending.length, color: "#d97706", icon: "⏳" },
                                { label: "Approved", value: approved.length, color: "#16a34a", icon: "✅" },
                                { label: "Rejected", value: rejected.length, color: "#dc2626", icon: "❌" },
                            ].map((stat, i) => (
                                <div key={i} style={styles.statCard}>
                                    <div style={{ fontSize: "28px" }}>{stat.icon}</div>
                                    <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
                                    <p style={styles.statLabel}>{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div style={styles.tableCard}>
                            <h3 style={styles.sectionTitle}>⏳ Pending Requests</h3>
                            {pending.length === 0 ? (
                                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                                    No pending requests
                                </p>
                            ) : (
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.tableHead}>
                                            <th style={styles.th}>Employee</th>
                                            <th style={styles.th}>Item</th>
                                            <th style={styles.th}>Qty</th>
                                            <th style={styles.th}>Priority</th>
                                            <th style={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pending.map((req, i) => (
                                            <tr key={i} style={styles.tableRow}>
                                                <td style={styles.td}>{req.employeeId?.name || req.employeeName}</td>
                                                <td style={styles.td}>{req.itemName}</td>
                                                <td style={styles.td}>{req.quantity}</td>
                                                <td style={styles.td}>
                                                    <span style={{ ...styles.badge, background: getPriorityColor(req.priority) + "20", color: getPriorityColor(req.priority) }}>
                                                        {req.priority}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <button style={styles.approveBtn} onClick={() => handleApprove(req)}>✅ Approve</button>
                                                    <button style={styles.rejectBtn} onClick={() => setRejectModal(req)}>❌ Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Incoming */}
                {activeMenu === "incoming" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>📥 Incoming Requests</h3>
                        {pending.length === 0 ? (
                            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No pending requests</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHead}>
                                        <th style={styles.th}>#</th>
                                        <th style={styles.th}>Employee</th>
                                        <th style={styles.th}>Item</th>
                                        <th style={styles.th}>Qty</th>
                                        <th style={styles.th}>Reason</th>
                                        <th style={styles.th}>Priority</th>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.map((req, i) => (
                                        <tr key={i} style={styles.tableRow}>
                                            <td style={styles.td}>{i + 1}</td>
                                            <td style={styles.td}>{req.employeeId?.name || req.employeeName}</td>
                                            <td style={styles.td}>{req.itemName}</td>
                                            <td style={styles.td}>{req.quantity}</td>
                                            <td style={styles.td}>{req.reason}</td>
                                            <td style={styles.td}>
                                                <span style={{ ...styles.badge, background: getPriorityColor(req.priority) + "20", color: getPriorityColor(req.priority) }}>
                                                    {req.priority}
                                                </span>
                                            </td>
                                            <td style={styles.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td style={styles.td}>
                                                <button style={styles.approveBtn} onClick={() => handleApprove(req)}>✅ Approve</button>
                                                <button style={styles.rejectBtn} onClick={() => setRejectModal(req)}>❌ Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Approved */}
                {activeMenu === "approved" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>✅ Approved — Sent to Accounts</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Employee</th>
                                    <th style={styles.th}>Item</th>
                                    <th style={styles.th}>Qty</th>
                                    <th style={styles.th}>Approved By</th>
                                    <th style={styles.th}>Accounts Status</th>
                                    <th style={styles.th}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approved.map((req, i) => (
                                    <tr key={i} style={styles.tableRow}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>{req.employeeId?.name || req.employeeName}</td>
                                        <td style={styles.td}>{req.itemName}</td>
                                        <td style={styles.td}>{req.quantity}</td>
                                        <td style={styles.td}>{req.approvedBy}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.badge,
                                                background: req.accountsStatus === "Completed" ? "#d1fae5" : req.accountsStatus === "Processing" ? "#fef9c3" : "#dbeafe",
                                                color: req.accountsStatus === "Completed" ? "#059669" : req.accountsStatus === "Processing" ? "#ca8a04" : "#2563eb"
                                            }}>
                                                {req.accountsStatus}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Rejected */}
                {activeMenu === "rejected" && (
                    <div style={styles.tableCard}>
                        <h3 style={styles.sectionTitle}>❌ Rejected Requests</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHead}>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Employee</th>
                                    <th style={styles.th}>Item</th>
                                    <th style={styles.th}>Qty</th>
                                    <th style={styles.th}>Reason</th>
                                    <th style={styles.th}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rejected.map((req, i) => (
                                    <tr key={i} style={styles.tableRow}>
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={styles.td}>{req.employeeId?.name || req.employeeName}</td>
                                        <td style={styles.td}>{req.itemName}</td>
                                        <td style={styles.td}>{req.quantity}</td>
                                        <td style={styles.td}>{req.rejectionReason}</td>
                                        <td style={styles.td}>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={{ marginTop: 0 }}>❌ Reject Request</h3>
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            Item: <b>{rejectModal.itemName}</b> | Qty: <b>{rejectModal.quantity}</b>
                        </p>
                        <label style={styles.label}>Rejection Reason *</label>
                        <select
                            style={styles.input}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        >
                            <option value="">Select reason</option>
                            <option>Not required</option>
                            <option>Budget issue</option>
                            <option>Duplicate request</option>
                            <option>Out of stock</option>
                            <option>Other</option>
                        </select>
                        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                            <button style={styles.rejectBtnModal} onClick={handleReject}>
                                ❌ Confirm Reject
                            </button>
                            <button style={styles.cancelBtn} onClick={() => { setRejectModal(null); setRejectReason(""); }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const styles = {
    wrapper: { display: "flex", height: "100vh", background: "#f1f5f9", fontFamily: "sans-serif" },
    sidebar: { width: "220px", background: "#0f172a", display: "flex", flexDirection: "column", padding: "20px 0", gap: "4px", flexShrink: 0 },
    sidebarLogo: { display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 20px 20px", borderBottom: "1px solid #1e293b" },
    logoText: { color: "#fff", fontWeight: "700", fontSize: "16px" },
    sidebarUser: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px", borderBottom: "1px solid #1e293b", marginBottom: "8px" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
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
    approveBtn: { padding: "5px 10px", background: "#d1fae5", color: "#059669", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", marginRight: "6px", fontWeight: "600" },
    rejectBtn: { padding: "5px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
    rejectBtnModal: { padding: "8px 16px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    cancelBtn: { padding: "8px 16px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13px" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modal: { background: "#fff", borderRadius: "12px", padding: "24px", width: "380px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" },
    label: { fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" },
    input: { width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "7px", fontSize: "14px", outline: "none", boxSizing: "border-box" }
};

export default DepartmentDashboard;