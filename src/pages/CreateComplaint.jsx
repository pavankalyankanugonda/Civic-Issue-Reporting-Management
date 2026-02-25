import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, MapPin, Type, FileText, AlertCircle } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';
import ImageUpload from '../components/ImageUpload';

const CreateComplaint = ({ user }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Roads',
        location: '',
        latitude: null,
        longitude: null,
        imageUrls: [],
        user: user ? { userId: user.userId } : null
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    if (!user) return <div style={{ color: 'white', padding: '20px' }}>Loading session...</div>;

    const handleLocationSelect = useCallback((coords, address) => {
        if (!coords || typeof coords.latitude !== 'number') return;
        setFormData(prev => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude,
            location: address || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
        }));
    }, []);

    const handleImageSelect = useCallback((files) => {
        setSelectedImages(files);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.latitude || !formData.longitude) {
            setStatus({ type: 'error', msg: 'Please select a location on the map.' });
            return;
        }

        setStatus({ type: '', msg: '' });
        setLoading(true);

        try {
            let finalImageUrls = [];

            if (selectedImages.length > 0) {
                const formDataWithImages = new FormData();
                selectedImages.forEach((file, index) => {
                    formDataWithImages.append('files', file);
                });

                const uploadResponse = await axios.post('/api/complaints/upload-images', formDataWithImages, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (uploadResponse.data.imageUrls) {
                    finalImageUrls = uploadResponse.data.imageUrls;
                }
            }

            await axios.post('/api/complaints', { ...formData, imageUrls: finalImageUrls });
            setStatus({ type: 'success', msg: 'Complaint submitted successfully!' });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            console.error('Submission error:', err);
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to submit complaint. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '30px', fontWeight: 'bold' }}>
                Report a <span style={{ color: '#6366f1' }}>Civic Issue</span>
            </h2>

            <div className="glass-morphism" style={{ padding: '40px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={labelStyle}>Issue Category</label>
                            <select style={inputStyle} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                <option value="Roads">Potholes / Road Damage</option>
                                <option value="Garbage">Garbage Overflow</option>
                                <option value="Water">Water Leakage</option>
                                <option value="Electricity">Streetlight Failure</option>
                                <option value="Drainage">Drainage Problems</option>
                                <option value="Other">Other Issues</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Issue Title</label>
                            <div style={inputContainerStyle}>
                                <Type size={18} style={iconStyle} />
                                <input type="text" placeholder="Briefly describe the issue" style={inputStyle} required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Detailed Description</label>
                        <div style={inputContainerStyle}>
                            <FileText size={18} style={{ ...iconStyle, top: '20px' }} />
                            <textarea
                                placeholder="Give more details about the problem..."
                                style={{ ...inputStyle, minHeight: '120px' }}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#6366f1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <AlertCircle size={14} /> Don't know the address? Just click on the map to pin the exact spot!
                        </p>
                    </div>
                    <LocationPicker onLocationSelect={handleLocationSelect} />

                    <ImageUpload onImageSelect={handleImageSelect} />

                    <div style={{ marginBottom: '25px', marginTop: '10px' }}>
                        <label style={labelStyle}>Nearby Landmark or Area (Optional)</label>
                        <div style={inputContainerStyle}>
                            <MapPin size={18} style={iconStyle} />
                            <input
                                type="text"
                                placeholder="e.g. Near Metro Pillar 123..."
                                style={inputStyle}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} disabled={loading}>
                        {loading ? 'Submitting...' : <><Send size={20} /> Submit Report</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' };
const inputContainerStyle = { position: 'relative' };
const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' };
const inputStyle = { width: '100%', paddingLeft: '40px' };

export default CreateComplaint;
