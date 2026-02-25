import React, { useState } from 'react';
import { Camera, X, UploadCloud, CheckCircle2, Plus } from 'lucide-react';

const ImageUpload = ({ onImageSelect }) => {
    const [previews, setPreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (previews.length < 5) { // Limit to 5 images
                handleFile(file);
            }
        });
    };

    const handleFile = (file) => {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Maximum 5MB allowed.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, etc).');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreview = { file, src: reader.result, id: Date.now() };
            const newPreviews = [...previews, newPreview];
            setPreviews(newPreviews);
            onImageSelect(newPreviews.map(p => p.file));
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
                if (previews.length < 5) {
                    handleFile(file);
                }
            });
        }
    };

    const handleRemoveImage = (id) => {
        const newPreviews = previews.filter(p => p.id !== id);
        setPreviews(newPreviews);
        onImageSelect(newPreviews.map(p => p.file));
    };

    return (
        <div style={{ marginBottom: '25px' }}>
            <label style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#6366f1" />
                Upload Photo of Damage
            </label>

            {!previews.length ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{
                        border: dragActive ? '2px solid #6366f1' : '2px dashed rgba(99, 102, 241, 0.3)',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.02)',
                        position: 'relative'
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                        id="image-input"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: '#6366f1' }}>
                            <UploadCloud size={32} />
                        </div>
                        <div>
                            <p style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '4px' }}>
                                Click to upload or drag and drop
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                PNG, JPG or WEBP (Max. 5MB each, up to 5 images)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                    {previews.map((preview, index) => (
                        <div key={preview.id} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid #6366f1', boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.4)' }}>
                            <img
                                src={preview.src}
                                alt={`Preview ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '8px',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                                    <CheckCircle2 size={14} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{index + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(preview.id)}
                                    style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '3px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {previews.length < 5 && (
                        <div
                            onClick={() => document.getElementById('image-input').click()}
                            style={{
                                border: '2px dashed rgba(99, 102, 241, 0.3)',
                                borderRadius: '16px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: 'rgba(99, 102, 241, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '120px'
                            }}
                        >
                            <Plus size={24} color="#6366f1" />
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px' }}>Add more</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
