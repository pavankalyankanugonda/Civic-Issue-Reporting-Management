import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, PlusCircle, User, Landmark } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="glass-morphism" style={{
            position: 'fixed',
            top: '15px',
            left: '20px',
            right: '20px',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                <Landmark size={28} color="#6366f1" />
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CivicReport
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={linkStyle}><LayoutDashboard size={20} /> Dashboard</Link>
                        {user.role === 'USER' && (
                            <Link to="/report-issue" style={linkStyle}><PlusCircle size={20} /> Report Issue</Link>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px', padding: '5px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                            <User size={18} />
                            <span style={{ fontSize: '0.9rem' }}>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const linkStyle = {
    textDecoration: 'none',
    color: '#94a3b8',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.3s'
};

export default Navbar;
