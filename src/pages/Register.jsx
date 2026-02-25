import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone, UserCheck, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'USER' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [displayedOtp, setDisplayedOtp] = useState('');
    const navigate = useNavigate();

    const sendOtp = async () => {
        setStatus({ type: '', msg: '' });
        setDisplayedOtp('');
        setLoading(true);
        try {
            const response = await axios.post('/api/users/send-otp', { email: formData.email });
            if (response.data.success) {
                setStatus({ type: 'success', msg: response.data.message });
                if (response.data.otp) {
                    setDisplayedOtp(response.data.otp);
                    setStatus({ type: 'success', msg: '✅ OTP sent! Check your email or use the OTP below for testing.' });
                }
                setStep(2);
            } else {
                setStatus({ type: 'error', msg: response.data.message || 'Failed to send OTP.' });
            }
        } catch (err) {
            console.error('OTP Error:', err);
            const errorMsg = err.response
                ? (err.response.data?.message || 'Server error. Please try again.')
                : 'Cannot connect to server. Please ensure the backend is running.';
            setStatus({ type: 'error', msg: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            sendOtp();
            return;
        }
        // Step 2: verify OTP and register
        setStatus({ type: '', msg: '' });
        setLoading(true);
        try {
            await axios.post('/api/users/register', { ...formData, otp });
            setStatus({ type: 'success', msg: 'Registration successful! Redirecting to login...' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Invalid OTP or registration failed. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ maxWidth: '450px', margin: '40px auto' }}>
            <div className="glass-morphism" style={{ padding: '40px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>Create Account</h2>
                <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px' }}>Join our civic community</p>

                {status.msg && (
                    <div style={{
                        background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: status.type === 'error' ? '#ef4444' : '#10b981',
                        padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <AlertCircle size={18} /> {status.msg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={inputContainerStyle}>
                                    <User size={18} style={iconStyle} />
                                    <input type="text" placeholder="John Doe" style={inputStyle} required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Email Address</label>
                                <div style={inputContainerStyle}>
                                    <Mail size={18} style={iconStyle} />
                                    <input type="email" placeholder="john@example.com" style={inputStyle} required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Phone Number</label>
                                <div style={inputContainerStyle}>
                                    <Phone size={18} style={iconStyle} />
                                    <input type="tel" placeholder="+91 9876543210" style={inputStyle} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={labelStyle}>Password</label>
                                <div style={inputContainerStyle}>
                                    <Lock size={18} style={iconStyle} />
                                    <input type="password" placeholder="••••••••" style={inputStyle} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={labelStyle}>Join as</label>
                                <div style={inputContainerStyle}>
                                    <UserCheck size={18} style={iconStyle} />
                                    <select style={inputStyle} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="USER">Citizen</option>
                                        <option value="ADMIN">Municipal Official</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Enter 6-Digit OTP</label>
                            <div style={inputContainerStyle}>
                                <Lock size={18} style={iconStyle} />
                                <input type="text" placeholder="123456" style={inputStyle} required value={otp} onChange={(e) => setOtp(e.target.value)} />
                            </div>

                            {displayedOtp && (
                                <div style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '2px solid #6366f1',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginTop: '15px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ margin: '0 0 10px 0', color: '#6366f1', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        📧 Test OTP (For Development):
                                    </p>
                                    <p style={{
                                        margin: '0',
                                        color: '#6366f1',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        letterSpacing: '4px',
                                        fontFamily: 'monospace',
                                        cursor: 'pointer'
                                    }} onClick={() => setOtp(displayedOtp)}>
                                        {displayedOtp}
                                    </p>
                                    <p style={{ margin: '8px 0 0 0', color: '#6366f1', fontSize: '0.75rem' }}>
                                        Click to auto-fill or type manually
                                    </p>
                                </div>
                            )}

                            <p style={{ fontSize: '0.8rem', color: '#6366f1', marginTop: '10px', cursor: 'pointer' }} onClick={() => setStep(1)}>
                                ← Change Email
                            </p>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
                        {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Verify & Register'}
                    </button>
                </form>

                <p style={{ marginTop: '25px', textAlign: 'center', color: '#94a3b8' }}>
                    Already have an account? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' };
const inputContainerStyle = { position: 'relative' };
const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' };
const inputStyle = { paddingLeft: '40px' };

export default Register;
