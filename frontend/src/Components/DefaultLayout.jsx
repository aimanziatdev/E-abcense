import { useState, useEffect } from "react";
import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import logo from '../assets/logo.png';  // Import the logo image

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data);
            })
            .catch(err => {
                console.error("Error fetching user data:", err);
            });
    }, [setUser]);

    if (!token) {
        return <Navigate to='/login' />
    }

    const handleLogout = (ev) => {
        ev.preventDefault();
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('ACCESS_TOKEN');
        navigate('/login');
    };

    const isAdmin = user && user.name === 'admin';

    return (
        <div id="defaultLayout">
            <div className="content">
                <header style={{ backgroundColor: 'darkblue', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            <span style={{ color: 'white' }}>E-</span>
                            <span style={{ color: '#DAA520' }}>ABSENCE</span>
                    </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isAdmin ? (
                            <>
                                <Link
                                    to="/admin/absence-management"
                                    style={{
                                        color: 'white',
                                        marginRight: '20px',
                                        borderBottom: location.pathname === "/admin/absence-management" ? "solid 3px #DAA520" : "none"
                                    }}>
                                    Absence Management
                                </Link>
                                <Link
                                    to="/users"
                                    style={{
                                        color: 'white',
                                        marginRight: '20px',
                                        borderBottom: location.pathname === "/users" ? "solid 3px #DAA520" : "none"
                                    }}>
                                    Teachers
                                </Link>
                                <Link
                                    to="/students"
                                    style={{
                                        color: 'white',
                                        marginRight: '20px',
                                        borderBottom: location.pathname === "/students" ? "solid 3px #DAA520" : "none"
                                    }}>
                                    Students
                                </Link>
                                <Link
                                    to="/classes"
                                    style={{
                                        color: 'white',
                                        marginRight: '20px',
                                        borderBottom: location.pathname === "/classes" ? "solid 3px #DAA520" : "none"
                                    }}>
                                    Classes
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/teacher/absence-management"
                                style={{
                                    color: 'white',
                                    marginRight: '20px',
                                    borderBottom: location.pathname === "/teacher/absence-management" ? "solid 3px #DAA520" : "none"
                                }}>
                                Absence Management
                            </Link>
                        )}
                        {user && (
                            <div style={{ display: 'inline-block', padding: '0.25rem 0.5rem', border: '2px solid #DAA520', borderRadius: '5px', marginRight: '20px' }}>
                                {user.name}
                            </div>
                        )}
                        <button onClick={handleLogout} style={{ backgroundColor: 'darkred', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Logout
                        </button>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {showLogoutConfirm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p>Are you sure you want to logout?</p>
                        <button onClick={confirmLogout} style={{ marginTop: '10px', backgroundColor: 'darkred', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Confirm
                        </button>
                        <button onClick={() => setShowLogoutConfirm(false)} style={{ marginTop: '10px', backgroundColor: 'gray', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
