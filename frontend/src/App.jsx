import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import DepartmentLogin from "./pages/DepartmentLogin";
import AccountsLogin from "./pages/AccountsLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import AccountsDashboard from "./pages/AccountsDashboard";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) return <Navigate to="/" />;
    if (role !== allowedRole) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/employee-login" element={<EmployeeLogin />} />
                <Route path="/department-login" element={<DepartmentLogin />} />
                <Route path="/accounts-login" element={<AccountsLogin />} />

                <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/employee" element={<ProtectedRoute allowedRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
                <Route path="/department" element={<ProtectedRoute allowedRole="department"><DepartmentDashboard /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute allowedRole="accounts"><AccountsDashboard /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;