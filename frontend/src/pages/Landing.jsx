import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Building2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Interactive cursor follow background glow */}
      <div 
        className="cursor-glow"
        style={{
          position: 'absolute',
          top: mousePos.y,
          left: mousePos.x,
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 0.1s ease'
        }}
      ></div>

      {/* Decorative background shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div className="glass-panel main-landing-panel animate-reveal">
        <div className="hero-content">
          <div className="icon-wrapper animate-float">
            <div className="icon-glow"></div>
            <Building2 size={64} strokeWidth={1.5} color="#fff" />
          </div>
          
          <div className="title-wrapper">
            <h2 className="subtitle">Enterprise Portal</h2>
            <h1 className="main-title">
              Task Management <span>System</span>
            </h1>
          </div>

          <p className="description">
            Welcome to the new <strong className="highlight-text">Xplore Intellects</strong> company dashboard. 
            Where Administrative oversight meets seamless Employee productivity.
          </p>

          <div className="action-buttons">
            <button 
              onClick={() => navigate('/admin/login')}
              className="btn-premium btn-admin" 
            >
              <div className="btn-bg"></div>
              <ShieldCheck size={22} />
              <span>Admin Portal</span>
            </button>

            <button 
              onClick={() => navigate('/employee/login')}
              className="btn-premium btn-employee" 
            >
              <div className="btn-bg"></div>
              <User size={22} />
              <span>Employee Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
