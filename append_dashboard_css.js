const fs = require('fs');

const cssToAppend = `
/* =========================================
   DASHBOARD PRO STYLES (Update)
   ========================================= */
.user-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}

/* User Badge Pro */
.user-badge-pro {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(30, 41, 59, 0.5); /* slate-800/50 */
    border: 1px solid #334155; /* slate-700 */
    padding: 6px 12px;
    border-radius: 50px;
}

.avatar-circle {
    width: 32px;
    height: 32px;
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.avatar-circle svg {
    width: 18px;
    height: 18px;
}

.status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: #10B981;
    border-radius: 50%;
    border: 2px solid #0f0f12;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-role {
    font-size: 0.85rem;
    font-weight: 600;
    color: #f8fafc;
    line-height: 1.1;
}

.user-status {
    font-size: 0.7rem;
    color: #10B981;
    line-height: 1.1;
}

/* Pro Buttons */
.btn-dashboard-primary {
    background: #10B981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}
.btn-dashboard-primary:hover {
    background: #059669;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-dashboard-secondary {
    background: #1e293b;
    color: #cbd5e1;
    border: 1px solid #334155;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}
.btn-dashboard-secondary:hover {
    background: #334155;
    color: #f1f5f9;
}

.btn-dashboard-logout {
    background: transparent;
    color: #64748b;
    border: 1px solid transparent;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
}
.btn-dashboard-logout:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
}

/* Pro Cards */
.pro-card {
    background: #161b22;
    border: 1px solid #1e293b;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pro-card:hover {
    border-color: rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1);
}

.pro-card h3 {
    margin-top: 15px;
    margin-bottom: 0;
    font-size: 1.1rem;
    color: #e2e8f0;
}

/* Icon Containers SVG */
.icon-container-pro {
    width: 48px;
    height: 48px;
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-large-pro {
    width: 64px;
    height: 64px;
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Banner Pro */
.banner-pro {
    background: #161b22;
    border: 1px solid #1e293b;
    border-radius: 12px;
    padding: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.banner-pro:hover {
    border-color: rgba(16, 185, 129, 0.4);
}

.banner-pro .banner-content {
    display: flex;
    align-items: center;
    gap: 20px;
}

.banner-pro h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #f8fafc;
}
`;

fs.appendFileSync('styles.css', cssToAppend, 'utf8');
console.log('styles.css appended');
