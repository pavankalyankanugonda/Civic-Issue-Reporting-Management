import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CheckCircle2, Clock, AlertTriangle, Filter, Trash2, Edit3,
    Map as MapIcon, List as ListIcon, Maximize2, X, ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Standard fix for Leaflet icons using CDN
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dashboard = ({ user }) => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/complaints');
            let data = response.data;
            if (user.role === 'USER') {
                data = data.filter(c => c.user?.userId === user.userId);
            }
            setComplaints(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`/api/complaints/${id}/status`, newStatus, {
                headers: { 'Content-Type': 'text/plain' }
            });
            fetchComplaints();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteComplaint = async (id) => {
        if (!window.confirm('Delete this report?')) return;
        try {
            await axios.delete(`/api/complaints/${id}`);
            fetchComplaints();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    const filteredComplaints = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

    return (
        <div className="animate-fade">
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '700' }}>Hey, {user.name.split(' ')[0]}! 👋</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '5px' }}>
                        {user.role === 'ADMIN' ? 'Reviewing all active civic issues' : 'Track the progress of your reports'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {/* View Switcher */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '4px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                background: viewMode === 'table' ? '#6366f1' : 'transparent',
                                color: viewMode === 'table' ? 'white' : '#94a3b8',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <ListIcon size={18} /> List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                background: viewMode === 'map' ? '#6366f1' : 'transparent',
                                color: viewMode === 'map' ? 'white' : '#94a3b8',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <MapIcon size={18} /> Live Map
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="glass-morphism" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Filter size={18} color="#6366f1" />
                        <select
                            style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px 20px 8px 0', width: '130px', fontSize: '0.9rem' }}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All Issues</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard title="Total Reports" count={stats.total} icon={<AlertTriangle color="#6366f1" />} color="rgba(99, 102, 241, 0.15)" />
                <StatCard title="Pending" count={stats.pending} icon={<Clock color="#f59e0b" />} color="rgba(245, 158, 11, 0.15)" />
                <StatCard title="In Progress" count={stats.inProgress} icon={<Edit3 color="#0ea5e9" />} color="rgba(14, 165, 233, 0.15)" />
                <StatCard title="Resolved" count={stats.resolved} icon={<CheckCircle2 color="#10b981" />} color="rgba(16, 185, 129, 0.15)" />
            </div>

            {/* Main Content Area */}
            {viewMode === 'table' ? (
                <div className="glass-morphism" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={thStyle}>Issue Details</th>
                                <th style={thStyle}>Category</th>
                                <th style={thStyle}>Location Info</th>
                                <th style={thStyle}>Reporting Date</th>
                                <th style={thStyle}>Current Status</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                        <AlertTriangle size={48} opacity={0.3} />
                                        <span>No civic reports found in this category.</span>
                                    </div>
                                </td></tr>
                            ) : filteredComplaints.map(complaint => (
                                <tr key={complaint.complaintId} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }} className="table-row-hover">
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            {complaint.imageUrls && complaint.imageUrls.length > 0 ? (
                                                <div style={{ position: 'relative' }}>
                                                    <div
                                                        style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative' }}
                                                        onClick={() => setSelectedPhoto(complaint.imageUrls[0])}
                                                        className="photo-hover"
                                                    >
                                                        <img src={complaint.imageUrls[0]} alt="Damage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }} className="hover-zoom">
                                                            <Maximize2 size={14} color="white" />
                                                        </div>
                                                    </div>
                                                    {complaint.imageUrls.length > 1 && (
                                                        <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#6366f1', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                            {complaint.imageUrls.length}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                    <AlertTriangle size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{complaint.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>{complaint.description.substring(0, 45)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}><span style={badgeStyle}>{complaint.category}</span></td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '0.9rem' }}>{complaint.location}</span>
                                            {complaint.latitude && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                                    target="_blank" rel="noreferrer"
                                                    style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                                >
                                                    <ExternalLink size={12} /> View GPS Location
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{new Date(complaint.createdDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td style={tdStyle}>
                                        <StatusBadge status={complaint.status} />
                                    </td>
                                    <td style={tdStyle}>
                                        {user.role === 'ADMIN' ? (
                                            <select
                                                style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', background: '#1e293b', border: '1px solid #334155', color: 'white' }}
                                                value={complaint.status}
                                                onChange={(e) => updateStatus(complaint.complaintId, e.target.value)}
                                            >
                                                <option value="Pending">Keep Pending</option>
                                                <option value="In Progress">Start Work</option>
                                                <option value="Resolved">Mark Fixed</option>
                                            </select>
                                        ) : (
                                            <button
                                                onClick={() => deleteComplaint(complaint.complaintId)}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px', borderRadius: '8px' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="glass-morphism" style={{ height: '600px', overflow: 'hidden', padding: '10px' }}>
                    <MapContainer center={[28.7041, 77.1025]} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        {filteredComplaints.filter(c => c.latitude).map(c => (
                            <Marker key={c.complaintId} position={[c.latitude, c.longitude]}>
                                <Popup>
                                    <div style={{ minWidth: '150px' }}>
                                        {c.imageUrls && c.imageUrls.length > 0 && (
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', overflowX: 'auto' }}>
                                                {c.imageUrls.slice(0, 3).map((url, idx) => (
                                                    <img key={idx} src={url} alt={`issue ${idx + 1}`} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                                                ))}
                                                {c.imageUrls.length > 3 && <div style={{ fontSize: '0.7rem', color: '#666', alignSelf: 'center' }}>+{c.imageUrls.length - 3}</div>}
                                            </div>
                                        )}
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{c.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{c.category} • {c.status}</div>
                                        <div style={{ marginTop: '8px' }}>
                                            <StatusBadge status={c.status} />
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

            {/* Photo Modal */}
            {selectedPhoto && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', color: 'black', padding: '10px', borderRadius: '50%' }}>
                        <X size={24} />
                    </button>
                    <img src={selectedPhoto} alt="Issue Full" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', border: '4px solid white' }} onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            <style>{`
                .photo-hover:hover .hover-zoom { opacity: 1 !important; transition: 0.3s; }
                .table-row-hover:hover { background: rgba(255,255,255,0.02); }
            `}</style>
        </div>
    );
};

const StatCard = ({ title, count, icon, color }) => (
    <div className="glass-morphism" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${icon.props.color}` }}>
        <div style={{ padding: '12px', background: color, borderRadius: '12px' }}>{icon}</div>
        <div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>{title}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '-1px' }}>{count}</div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = {
        'Pending': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
        'In Progress': { color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)' },
        'Resolved': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
    };
    const { color, bg } = config[status] || config['Pending'];
    return (
        <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: bg, color: color }}>
            {status}
        </span>
    );
};

const thStyle = { padding: '18px 20px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '18px 20px', fontSize: '0.95rem' };
const badgeStyle = { padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' };

export default Dashboard;
