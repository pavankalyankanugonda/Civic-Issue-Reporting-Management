import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, BarChart3, Clock } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="animate-fade">
            <header style={{ textAlign: 'center', padding: '60px 0' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800' }}>
                    Cleaner Cities, <span style={{ color: '#6366f1' }}>Better Tomorrow.</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px' }}>
                    Empowering citizens to report and resolve local civic issues. Join thousands of residents making their neighborhoods safer and cleaner.
                </p>
                <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '15px 40px', textDecoration: 'none', borderRadius: '30px' }}>
                    Report an Issue Now
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', margin: '60px 0' }}>
                <FeatureCard
                    icon={<MapPin size={32} color="#0ea5e9" />}
                    title="Easy Reporting"
                    desc="Submit issues like potholes or garbage with photos and location in seconds."
                />
                <FeatureCard
                    icon={<Clock size={32} color="#10b981" />}
                    title="Real-time Tracking"
                    desc="Stay updated with live status changes as the municipal staff works on your report."
                />
                <FeatureCard
                    icon={<Shield size={32} color="#6366f1" />}
                    title="Verified Action"
                    desc="Every complaint is assigned to designated staff for verified resolution."
                />
                <FeatureCard
                    icon={<BarChart3 size={32} color="#f59e0b" />}
                    title="Data Transparency"
                    desc="Public dashboard showing collective progress in your municipal ward."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-morphism" style={{ padding: '30px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', display: 'inline-block', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '15px' }}>{title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

export default LandingPage;
