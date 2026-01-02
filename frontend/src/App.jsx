import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Activity,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ClipboardList,
  Bot,
  Menu,
  X,
  LogIn,
  Calendar,
  Database,
  Users,
  ShieldAlert,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LabelList,
} from 'recharts';

// const API_BASE = "http://localhost:8000";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const COLORS = ['#2E57A5', '#3AD4FF', '#10B981', '#F59E0B', '#EF4444'];

const getSeverityBadge = (sev) => {
  const s = sev?.toString().toLowerCase();
  if (s?.includes('critical') || s?.includes('high')) return <span className="badge badge-danger">{sev}</span>;
  if (s?.includes('medium') || s?.includes('warn')) return <span className="badge badge-warning">{sev}</span>;
  return <span className="badge badge-success">{sev}</span>;
};

const getStatusBadge = (status) => {
  const s = status?.toLowerCase();
  if (s === 'active' || s === 'passed' || s === 'final report') return <span className="badge badge-success">{status}</span>;
  if (s === 'pending' || s === 'fieldwork' || s === 'scheduled') return <span className="badge badge-warning">{status}</span>;
  return <span className="badge" style={{ background: '#F1F5F9', color: '#64748B' }}>{status}</span>;
};

function App() {
  const [stats, setStats] = useState(null);
  const [governance, setGovernance] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [regulatory, setRegulatory] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [findings, setFindings] = useState([]);
  const [auditSummary, setAuditSummary] = useState(null);
  const [auditRaw, setAuditRaw] = useState([]);
  const [auditPlan, setAuditPlan] = useState([]);
  const [riskRegister, setRiskRegister] = useState([]);
  const [assetRegister, setAssetRegister] = useState([]);
  const [vendorRegister, setVendorRegister] = useState([]);
  const [vulnReport, setVulnReport] = useState([]);
  const [bcpData, setBcpData] = useState([]);
  const [kpiTrend, setKpiTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu when switching tabs
    setMobileMenuOpen(false);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all([
        axios.get(`${API_BASE}/stats/dashboard`),
        axios.get(`${API_BASE}/data/governance`),
        axios.get(`${API_BASE}/data/compliance`),
        axios.get(`${API_BASE}/data/regulatory`),
        axios.get(`${API_BASE}/data/security-logs`),
        axios.get(`${API_BASE}/data/findings`),
        axios.get(`${API_BASE}/audit/summary`),
        axios.get(`${API_BASE}/audit/raw`),
        axios.get(`${API_BASE}/data/audit-plan`),
        axios.get(`${API_BASE}/data/risk-register`),
        axios.get(`${API_BASE}/data/asset-register`),
        axios.get(`${API_BASE}/data/vendor-register`),
        axios.get(`${API_BASE}/data/vulnerability-report`),
        axios.get(`${API_BASE}/data/bcp-dr`),
        axios.get(`${API_BASE}/stats/kpi`),
      ]);
      
      const [statsRes, govRes, compRes, regRes, logsRes, findRes, audSumRes, audRawRes, planRes, riskRes, assetRes, vendorRes, vulnRes, bcpRes, kpiRes] = results;

      setStats(statsRes.data);
      setGovernance(govRes.data || []);
      setCompliance(compRes.data || []);
      setRegulatory(regRes.data || []);
      setSecurityLogs(logsRes.data || []);
      setFindings(findRes.data || []);
      setAuditSummary(audSumRes.data);
      setAuditRaw(audRawRes.data || []);
      setAuditPlan(planRes.data || []);
      setRiskRegister(riskRes.data || []);
      setAssetRegister(assetRes.data || []);
      setVendorRegister(vendorRes.data || []);
      setVulnReport(vulnRes.data || []);
      setBcpData(bcpRes.data || []);
      setKpiTrend(kpiRes.data || []);
    } catch (err) {
      console.error("API Error:", err);
      setError(`Backend Connection Failure: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#EF4444', padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={64} style={{ marginBottom: '1.5rem' }} />
        <h1 style={{ marginBottom: '1rem', fontWeight: 900 }}>System Connection Lost</h1>
        <p style={{ color: '#64748B', maxWidth: '500px', fontSize: '1.1rem' }}>{error}</p>
        <button onClick={fetchData} style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: '#2E57A5', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className={`mobile-overlay ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', padding: '0.5rem 0' }}>
          <div className="logo-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem' }}>
            <ShieldCheck size={32} strokeWidth={2.5} color="#2E57A5" />
            <span className="gradient-text">GRC Portal</span>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(false)} style={{ display: mobileMenuOpen ? 'flex' : 'none', border: 'none', background: 'none', boxShadow: 'none' }}>
            <X size={24} color="#64748B" />
          </button>
        </div>
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'governance' ? 'active' : ''}`} onClick={() => setActiveTab('governance')}>
            <ShieldCheck size={20} /> Governance
          </li>
          <li className={`nav-item ${activeTab === 'compliance' ? 'active' : ''}`} onClick={() => setActiveTab('compliance')}>
            <AlertCircle size={20} /> Compliance
          </li>
          <li className={`nav-item ${activeTab === 'regulatory' ? 'active' : ''}`} onClick={() => setActiveTab('regulatory')}>
            <FileText size={20} /> Regulatory
          </li>
          <li className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Activity size={20} /> Security Logs
          </li>
          <li className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            <ClipboardList size={20} /> Audit
          </li>
          <li className={`nav-item ${activeTab === 'planning' ? 'active' : ''}`} onClick={() => setActiveTab('planning')}>
            <Calendar size={20} /> Audit Planning
          </li>
          <li className={`nav-item ${activeTab === 'risks' ? 'active' : ''}`} onClick={() => setActiveTab('risks')}>
            <AlertTriangle size={20} /> Risks
          </li>
          <li className={`nav-item ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>
            <Database size={20} /> Assets
          </li>
          <li className={`nav-item ${activeTab === 'vendors' ? 'active' : ''}`} onClick={() => setActiveTab('vendors')}>
            <Users size={20} /> Vendors
          </li>
          <li className={`nav-item ${activeTab === 'vulns' ? 'active' : ''}`} onClick={() => setActiveTab('vulns')}>
            <ShieldAlert size={20} /> Vulnerabilities
          </li>
          <li className={`nav-item ${activeTab === 'bcp' ? 'active' : ''}`} onClick={() => setActiveTab('bcp')}>
            <RefreshCw size={20} /> BCP/DR
          </li>
        </ul>

        <div className="sidebar-footer">
          <button className="login-btn">
            <LogIn size={20} />
            <span>Log In</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="header-titles">
              {activeTab === 'dashboard' ? (
                <>
                  <h1>Integrated Dashboard</h1>
                  <p>Governance, Risk & Compliance</p>
                </>
              ) : (
                  <h1 style={{ textTransform: 'capitalize' }}>{activeTab} Overview</h1>
              )}
            </div>
          </div>
          
          {activeTab === 'dashboard' && (
            <div className="user-profile">
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3AD4FF, #2E57A5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Bot size={18} />
              </div>
              <span style={{ fontWeight: '800', color: '#1E293B', fontSize: '0.875rem' }}>Simulation AI</span>
            </div>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-fade">
            {/* Row 1: Enterprise Audit Metrics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#a23080ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <LayoutDashboard size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0e020eff', margin: 0 }}>Audit</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-card split-card">
                <div className="split-left">
                   <div className="stat-value">{auditSummary?.open_audits || 0}</div>
                   <div className="stat-label" style={{ marginTop: '0.5rem' }}>Open Audits</div>
                </div>
                <div className="split-right">
                   <div style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '1rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audits by Status</div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {['Fieldwork', 'Final Report', 'Scheduled'].map(status => (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'Fieldwork' ? '#10B981' : status === 'Final Report' ? '#F59E0B' : '#6366F1' }}></div>
                              <span style={{ fontWeight: '800' }}>{auditSummary?.status_distribution?.[status] || 0}</span>
                           </div>
                           <span style={{ color: '#64748B', fontWeight: '600' }}>{status}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="stat-card split-card">
                <div className="split-left">
                   <div className="stat-value">{auditSummary?.total_entities || 0}</div>
                 </div>
                 <div className="split-right">
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '1rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Classification</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       {['Low', 'Medium', 'High'].map(risk => (
                         <div key={risk} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: risk === 'Low' ? '#10B981' : risk === 'Medium' ? '#FBBF24' : '#EF4444' }}></div>
                               <span style={{ fontWeight: '800' }}>{auditSummary?.entities_by_risk?.[risk] || 0}</span>
                            </div>
                            <span style={{ color: '#64748B', fontWeight: '600' }}>{risk}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="stat-card split-card">
                <div className="split-left">
                   <div className="stat-value">{auditSummary?.open_issues || 0}</div>
                   <div className="stat-label" style={{ marginTop: '0.5rem' }}>Open Issues</div>
                </div>
                <div className="split-right">
                   <div style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '1rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue Breakdown</div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {['Critical', 'High', 'Medium', 'Low'].map(risk => (
                        <div key={risk} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: risk === 'Critical' ? '#EF4444' : risk === 'High' ? '#F97316' : risk === 'Medium' ? '#FBBF24' : '#10B981' }}></div>
                              <span style={{ fontWeight: '800' }}>{auditSummary?.issues_by_risk?.[risk] || 0}</span>
                           </div>
                           <span style={{ color: '#64748B', fontWeight: '600' }}>{risk}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Row 2: New GRC Modules Overview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', marginTop: '3rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3AD4FF, #2E57A5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <LayoutDashboard size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>GRC Intelligence Dashboard</h2>
            </div>

            {/* Analytics Grid - New Modules */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              {/* Audit Planning Analytics */}
              <div className="stat-card">
                <div className="stat-label">Audit Sessions</div>
                <div className="stat-value" style={{ marginBottom: '0.5rem' }}>{auditPlan.length}</div>
                <div className="chart-wrapper" style={{ height: '100px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{v:25},{v:25},{v:50}]}
                        cx="50%" cy="100%"
                        startAngle={180} endAngle={0}
                        innerRadius={35} outerRadius={50}
                        dataKey="v" stroke="none"
                      >
                        <Cell fill="#EF4444" /><Cell fill="#FBBF24" /><Cell fill="#10B981" />
                      </Pie>
                      <Pie
                        data={[
                          {v: auditPlan.length ? (auditPlan.filter(p => p.status === 'Completed' || p.status === 'Closed').length / auditPlan.length * 100) : 0}, 
                          {v: 1}, 
                          {v: 100 - (auditPlan.length ? (auditPlan.filter(p => p.status === 'Completed' || p.status === 'Closed').length / auditPlan.length * 100) : 0)}
                        ]}
                        cx="50%" cy="100%"
                        startAngle={180} endAngle={0}
                        innerRadius={0} outerRadius={40}
                        dataKey="v" stroke="none"
                      >
                         <Cell fill="none" /><Cell fill="#0F172A" /><Cell fill="none" />
                      </Pie>
                      <text x="50%" y="90%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '1.25rem', fontWeight: '900', fill: '#0F172A' }}>
                        {auditPlan.length ? Math.round((auditPlan.filter(p => p.status === 'Completed' || p.status === 'Closed').length / auditPlan.length) * 100) : 0}%
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.25rem', fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                  {auditPlan.filter(p => p.status === 'Completed' || p.status === 'Closed').length} Completed
                </div>
              </div>

              {/* Risk Register Analytics */}
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <div className="stat-label">Risk Register</div>
                </div>
                <div className="stat-value">{riskRegister.length}</div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
                  High Residual: {riskRegister.filter(r => r.residual_risk >= 12).length}
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ 
                      flex: 1, 
                      height: '4px', 
                      background: i < (riskRegister.filter(r => r.residual_risk >= 12).length / riskRegister.length * 5) ? '#EF4444' : '#F1F5F9',
                      borderRadius: '2px'
                    }}></div>
                  ))}
                </div>
              </div>

              {/* Asset Compliance Analytics */}
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Database size={16} color="#2E57A5" />
                  <div className="stat-label">Asset Inventory</div>
                </div>
                <div className="stat-value">{assetRegister.length}</div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
                  Unpatched: {assetRegister.filter(a => a.patched === 'No').length}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>
                  Compliance: {assetRegister.length ? Math.round((assetRegister.filter(a => a.patched === 'Yes').length / assetRegister.length) * 100) : 0}%
                </div>
              </div>

              {/* Vendor Risk Analytics */}
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Users size={16} color="#F59E0B" />
                  <div className="stat-label">Vendor Portfolio</div>
                </div>
                <div className="stat-value">{vendorRegister.length}</div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
                  High Risk: {vendorRegister.filter(v => v.risk_rating === 'High').length}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Distribution</div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: '#F1F5F9' }}>
                    {vendorRegister.filter(v => v.risk_rating === 'Low').length > 0 && (
                      <div 
                        style={{ 
                          width: `${(vendorRegister.filter(v => v.risk_rating === 'Low').length / vendorRegister.length) * 100}%`, 
                          background: '#10B981' 
                        }} 
                        title={`Low: ${vendorRegister.filter(v => v.risk_rating === 'Low').length}`}
                      />
                    )}
                    {vendorRegister.filter(v => v.risk_rating === 'Medium').length > 0 && (
                      <div 
                        style={{ 
                          width: `${(vendorRegister.filter(v => v.risk_rating === 'Medium').length / vendorRegister.length) * 100}%`, 
                          background: '#FBBF24' 
                        }}
                        title={`Medium: ${vendorRegister.filter(v => v.risk_rating === 'Medium').length}`}
                      />
                    )}
                    {vendorRegister.filter(v => v.risk_rating === 'High').length > 0 && (
                      <div 
                        style={{ 
                          width: `${(vendorRegister.filter(v => v.risk_rating === 'High').length / vendorRegister.length) * 100}%`, 
                          background: '#EF4444' 
                        }}
                        title={`High: ${vendorRegister.filter(v => v.risk_rating === 'High').length}`}
                      />
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', fontWeight: 600 }}>
                    <span style={{ color: '#10B981' }}>Low: {vendorRegister.filter(v => v.risk_rating === 'Low').length}</span>
                    <span style={{ color: '#FBBF24' }}>Med: {vendorRegister.filter(v => v.risk_rating === 'Medium').length}</span>
                    <span style={{ color: '#EF4444' }}>High: {vendorRegister.filter(v => v.risk_rating === 'High').length}</span>
                  </div>
                </div>
              </div>

              {/* Vulnerability Analytics */}
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ShieldAlert size={16} color="#EF4444" />
                  <div className="stat-label">Vulnerabilities</div>
                </div>
                <div className="stat-value">{vulnReport.length}</div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
                  Critical: {vulnReport.filter(v => v.severity === 'Critical').length}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#64748B' }}>
                  Unpatched: {vulnReport.filter(v => v.patched === 'No').length}
                </div>
              </div>

              {/* BCP/DR Analytics */}
              <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <RefreshCw size={16} color="#10B981" />
                  <div className="stat-label">BCP/DR Plans</div>
                </div>
                <div className="stat-value">{bcpData.length}</div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                  Passed: {bcpData.filter(b => b.status === 'Pass').length}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#EF4444' }}>
                  Failed: {bcpData.filter(b => b.status === 'Fail').length}
                </div>
              </div>
            </div>

            {/* Row 2: Risk & Vulnerability Visualizations */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', marginTop: '3rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#EF4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <AlertTriangle size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Risk & Vulnerability Intelligence</h2>
            </div>

            <div className={`grid-container-mobile`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Vulnerability Severity Distribution */}
              <div className="section-card">
                <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <ShieldAlert color="#EF4444" size={20} /> Vulnerability Severity
                </h2>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Critical', value: vulnReport.filter(v => v.severity === 'Critical').length },
                          { name: 'High', value: vulnReport.filter(v => v.severity === 'High').length },
                          { name: 'Medium', value: vulnReport.filter(v => v.severity === 'Medium').length },
                          { name: 'Low', value: vulnReport.filter(v => v.severity === 'Low').length }
                        ].filter(d => d.value > 0)}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ value }) => value}
                      >
                        <Cell fill="#EF4444" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#FBBF24" />
                        <Cell fill="#10B981" />
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Vendor Risk Distribution */}
              <div className="section-card">
                <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <Users color="#F59E0B" size={20} /> Vendor Risk Profile
                </h2>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Low', count: vendorRegister.filter(v => v.risk_rating === 'Low').length },
                      { name: 'Medium', count: vendorRegister.filter(v => v.risk_rating === 'Medium').length },
                      { name: 'High', count: vendorRegister.filter(v => v.risk_rating === 'High').length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        <Cell fill="#10B981" />
                        <Cell fill="#FBBF24" />
                        <Cell fill="#EF4444" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 3: Asset & BCP Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', marginTop: '3rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <CheckCircle2 size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Compliance & Resilience</h2>
            </div>

            <div className={`grid-container-mobile`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              {/* Asset Patch Status */}
              <div className="section-card">
                <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <Database color="#2E57A5" size={20} /> Asset Patch Coverage
                </h2>
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B' }}>Patched Assets</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981' }}>
                      {assetRegister.length ? Math.round((assetRegister.filter(a => a.patched === 'Yes').length / assetRegister.length) * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ height: '12px', background: '#F1F5F9', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      width: `${assetRegister.length ? (assetRegister.filter(a => a.patched === 'Yes').length / assetRegister.length * 100) : 0}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #10B981, #34D399)' 
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, padding: '0.75rem', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981' }}>
                        {assetRegister.filter(a => a.patched === 'Yes').length}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#16A34A', marginTop: '0.25rem' }}>Secure</div>
                    </div>
                    <div style={{ flex: 1, padding: '0.75rem', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EF4444' }}>
                        {assetRegister.filter(a => a.patched === 'No').length}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#DC2626', marginTop: '0.25rem' }}>At Risk</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BCP/DR Test Results */}
              <div className="section-card">
                <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <RefreshCw color="#10B981" size={20} /> BCP/DR Test Results
                </h2>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pass', value: bcpData.filter(b => b.status === 'Pass').length },
                          { name: 'Fail', value: bcpData.filter(b => b.status === 'Fail').length },
                          { name: 'Planned', value: bcpData.filter(b => b.status === 'Planned').length }
                        ].filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ value }) => value}
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#EF4444" />
                        <Cell fill="#FBBF24" />
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 4: Original Governance & Compliance Sections */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', marginTop: '3rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#2E57A5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <ShieldCheck size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Core GRC Metrics</h2>
            </div>

            <div className={`grid-container-mobile`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-label">Active Policies</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div className="stat-value">{stats?.policies?.total || 0}</div>
                </div>
                <div className="stat-trend trend-up" style={{ color: '#10B981' }}><CheckCircle2 size={16} /> Comprehensive</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Compliance Violations</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div className="stat-value">{stats?.compliance?.total_violations || 0}</div>
                </div>
                <div className="stat-trend trend-up"><TrendingUp size={16} /> Requires Attention</div>
              </div>
            </div>

            <div className="section-card" style={{ marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}><ShieldCheck color="#2E57A5" size={20} /> System Compliance Index</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.compliance?.system_metrics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Risk Index', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="risk_index" radius={[4, 4, 0, 0]}>
                      {stats?.compliance?.system_metrics?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 5: KPI Trend & Reports */}
            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', background: '#3AD4FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                     <TrendingUp size={18} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Quarterly Insights & Reports</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    id="gen-pdf-btn"
                    onClick={async () => {
                      try {
                        const res = await axios.get(`${API_BASE}/report/pdf`);
                        alert(`PDF Report Generated: ${res.data.file}`);
                      } catch(e) { alert("Failed to generate PDF"); }
                    }}
                    className="login-btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: '#EF4444' }}>
                    Download RBI PDF
                  </button>
                  <button 
                    id="gen-excel-btn"
                    onClick={async () => {
                      try {
                        const res = await axios.get(`${API_BASE}/report/excel`);
                        alert(`Excel Report Generated: ${res.data.file}`);
                      } catch(e) { alert("Failed to generate Excel"); }
                    }}
                    className="login-btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: '#10B981' }}>
                    Export GRC Excel
                  </button>
                </div>
              </div>

              <div className="section-card">
                <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}><Activity color="#2E57A5" size={20} /> Quarterly Risk/KPI Trend</h2>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpiTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="quarter" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="count" stroke="#2E57A5" strokeWidth={4} dot={{ r: 6, fill: '#2E57A5', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="section-card animate-fade">
            <h2 className="section-title"><ShieldCheck color="#2E57A5" /> Governance Policies</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Last Review</th>
                  </tr>
                </thead>
                <tbody>
                  {governance.map((policy, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 800, color: '#94A3B8' }}>{policy.policy_id}</td>
                      <td>{policy.policy_name}</td>
                      <td>{getStatusBadge(policy.status)}</td>
                      <td>{policy.last_review_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="section-card animate-fade">
            <h2 className="section-title"><AlertCircle color="#EF4444" /> Compliance Violations</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Regulation</th>
                    <th>System</th>
                    <th>Issue</th>
                    <th>Severity</th>
                    <th>Detected On</th>
                  </tr>
                </thead>
                <tbody>
                  {compliance.map((v, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 800, color: '#94A3B8' }}>{v.violation_id}</td>
                      <td>{v.regulation_id}</td>
                      <td>{v.system}</td>
                      <td>{v.issue}</td>
                      <td>{getSeverityBadge(v.severity)}</td>
                      <td style={{ fontSize: '0.85rem' }}>{v.detected_on}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="section-card animate-fade">
            <h2 className="section-title"><FileText color="#F59E0B" /> Regulatory Clauses</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Requirement ID</th>
                    <th>Clause</th>
                    <th>Description</th>
                    <th>Criticality</th>
                  </tr>
                </thead>
                <tbody>
                  {regulatory.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 800, color: '#94A3B8' }}>{r.regulation_id}</td>
                      <td>{r.clause}</td>
                      <td style={{ fontSize: '0.9rem' }}>{r.description}</td>
                      <td>{getSeverityBadge(r.criticality)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="section-card animate-fade">
            <h2 className="section-title"><Activity color="#2E57A5" /> Security Event Logs</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Event Type</th>
                    <th>User</th>
                    <th>Details</th>
                    <th>Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {securityLogs.map((log, i) => (
                    <tr key={i}>
                      <td style={{ color: '#64748B', fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ fontWeight: 700 }}>{log.event_type}</td>
                      <td>{log.user}</td>
                      <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                      <td style={{ fontWeight: 900, color: (log.risk_score || 0) > 70 ? '#EF4444' : '#1E293B' }}>{log.risk_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="section-card animate-fade">
            <h2 className="section-title"><ClipboardList color="#2E57A5" /> Raw Audit Records</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Audit ID</th>
                    <th>Type</th>
                    <th>Entity</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th>Manager</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {auditRaw.slice(0, 15).map((item, i) => (
                    <tr key={i}>
                      <td style={{ color: '#94A3B8', fontWeight: 800 }}>{item.audit_id}</td>
                      <td>{item.audit_type}</td>
                      <td>{item.entity}</td>
                      <td>{getSeverityBadge(item.risk_rating)}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td style={{ fontWeight: 600 }}>{item.audit_manager}</td>
                      <td>{item.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ported New Tabs */}
        {activeTab === 'planning' && (
          <div className="section-card animate-fade">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title"><Calendar color="#2E57A5" /> Audit Planning & Sessions</h2>
                <button onClick={() => axios.post(`${API_BASE}/run/audit-planning`)} className="login-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>Run Planning Agent</button>
             </div>
             <div className="data-table-container">
               <table className="data-table">
                 <thead><tr><th>audit_id</th><th>audit_area</th><th>frequency</th><th>scope</th></tr></thead>
                 <tbody>
                   {auditPlan.map((p, i) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 800 }}>{p.audit_id}</td>
                       <td>{p.audit_area}</td>
                       <td>{p.frequency}</td>
                       <td>{p.scope}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="section-card animate-fade">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title"><AlertTriangle color="#EF4444" /> Enterprise Risk Register</h2>
                <button onClick={() => axios.post(`${API_BASE}/run/risk`)} className="login-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#EF4444' }}>Analyze RCSA</button>
             </div>
             <div className="data-table-container">
               <table className="data-table">
                 <thead><tr><th>ID</th><th>Process</th><th>Residual Risk</th><th>Owner</th></tr></thead>
                 <tbody>
                   {riskRegister.map((r, i) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 800 }}>{r.risk_id}</td>
                       <td>{r.process}</td>
                       <td style={{ fontWeight: 900 }}>{r.residual_risk}</td>
                       <td>{r.owner}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="section-card animate-fade">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title"><Database color="#2E57A5" /> Asset Inventory & Compliance</h2>
                <button onClick={() => axios.post(`${API_BASE}/run/assets`)} className="login-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>Audit Assets</button>
             </div>
             <div className="data-table-container">
               <table className="data-table">
                 <thead><tr><th>Asset ID</th>
                 <th>asset_type</th>
                 <th>criticality</th>
                 <th>Patched</th>
                 <th>last_patch_date</th>
                 </tr></thead>
                 <tbody>
                   {assetRegister.map((a, i) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 800 }}>{a.asset_id}</td>
                       <td>{a.asset_type}</td>
                        <td>{a.criticality}</td>
                       <td>{a.patched}</td>
                       <td>{a.last_patch_date}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="section-card animate-fade">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title"><Users color="#F59E0B" /> Vendor Risk Management</h2>
                <button onClick={() => axios.post(`${API_BASE}/run/vendors`)} className="login-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#F59E0B' }}>Assess Vendors</button>
             </div>
             <div className="data-table-container">
               <table className="data-table">
                 <thead><tr><th>vendor_id</th>
                 <th>vendor_name</th>
                 <th>service</th>
                 <th>criticality</th>
                 <th>last_assessment</th>
                 <th>contract_expiry</th>
                 </tr></thead>
                 <tbody>
                   {vendorRegister.map((v, i) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 700 }}>{v.vendor_id}</td>
                       <td>{v.vendor_name}</td>
                       <td>{v.service}</td>
                       <td>{v.criticality}</td>
                       <td>{v.last_assessment}</td>
                       <td>{v.contract_expiry}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'vulns' && (
          <div className="section-card animate-fade">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title"><ShieldAlert color="#EF4444" /> Vulnerability Assessment Report</h2>
                <button onClick={() => axios.post(`${API_BASE}/run/vulnerabilities`)} className="login-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#EF4444' }}>Scan Network</button>
             </div>
             <div className="data-table-container">
               <table className="data-table">
                 <thead><tr><th>vuln_id</th>
                 <th>asset_id</th>
                 <th>severity</th>
                 <th>cve</th>
                 <th>patched</th>
                 </tr></thead>
                 <tbody>
                   {vulnReport.map((v, i) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 900 }}>{v.vuln_id}</td>
                       <td>{v.asset_id}</td>
                       <td>{v.severity}</td>
                       <td>{v.cve}</td>
                       <td>{v.patched}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'bcp' && (
          <div className="section-card animate-fade">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title"><RefreshCw color="#10B981" /> BCP & Disaster Recovery Logs</h2>
                <button onClick={() => axios.post(`${API_BASE}/run/bcp`)} className="login-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#10B981' }}>Test Resilience</button>
             </div>
             <div className="data-table-container">
               <table className="data-table">
                 <thead><tr><th>process</th>
                 <th>rto_hours</th>
                 <th>rpo_hours</th>
                 <th>last_test_date</th>
                 <th>Status</th>
                 </tr></thead>
                 <tbody>
                   {bcpData.map((b, i) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 700 }}>{b.process}</td>
                       <td>{b.rto_hours}</td>
                       <td>{b.rpo_hours}</td>
                       <td>{b.last_test_date}</td>
                       <td>{getStatusBadge(b.status)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
