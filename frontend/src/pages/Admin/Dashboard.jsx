import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, PlusCircle, LogOut, Briefcase, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useToast } from '../../components/Toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/admin/login');
    } else {
      fetchEmployees();
      fetchTasks();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/employees`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      setEmployees(data || []);
    } catch (error) {
      showToast('Failed to fetch employees', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/tasks`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      setTasks(data || []);
    } catch (error) {
      showToast('Failed to fetch tasks', 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/employees/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if(res.ok) {
        showToast('✅ Employee Access Approved!');
        fetchEmployees();
      } else {
        showToast('Error approving employee', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify({ title: newTaskTitle, description: newTaskDesc, assignedTo: selectedUser, dueDate: newTaskDeadline })
      });
      if(res.ok) {
        showToast('🎉 Task successfully assigned!');
        setNewTaskTitle('');
        setNewTaskDesc('');
        setSelectedUser('');
        setNewTaskDeadline('');
        fetchTasks();
        setActiveTab('tasks');
      } else {
        showToast('Failed to assign task', 'error');
      }
    } catch (error) {
       showToast('Network error', 'error');
    } finally {
       setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Analytics Metrics
  const totalEmployees = employees.length;
  const pendingApprovals = employees.filter(e => !e.isApproved).length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  return (
    <>
      <ToastContainer />
      <nav className="navbar">
        <div className="navbar-brand">Xplore Intellects | Admin</div>
        <button onClick={logout} className="btn-secondary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="dashboard-layout animate-fade-in">
        <aside className="sidebar">
          <div className="sidebar-nav">
            <div 
              className={`sidebar-item ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              <Users size={20} /> Manage Employees
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <FileText size={20} /> View All Tasks
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'assign' ? 'active' : ''}`}
              onClick={() => setActiveTab('assign')}
            >
              <PlusCircle size={20} /> Assign Task
            </div>
          </div>
        </aside>

        <main className="dashboard-content">
          
          {/* Analytics Dashboard Grid */}
          <div className="analytics-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Briefcase size={24} />
              </div>
              <div className="stat-content">
                <h4>Total Staff</h4>
                <h2>{totalEmployees}</h2>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <h4>Pending Approvals</h4>
                <h2>{pendingApprovals}</h2>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-content">
                <h4>Tasks Completed</h4>
                <h2>{completedTasks}</h2>
              </div>
            </div>
          </div>

          {activeTab === 'employees' && (
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div className="page-header">
                <h2>Employee Directory</h2>
              </div>
              {isLoading ? (
                 <div style={{ textAlign: 'center', padding: '40px' }}><span className="loader"></span></div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>
                          {emp.isApproved 
                            ? <span className="badge badge-completed">Approved</span>
                            : <span className="badge badge-pending">Pending</span>
                          }
                        </td>
                        <td>
                          {!emp.isApproved && (
                            <button onClick={() => handleApprove(emp._id)} className="btn-primary btn-small" style={{ animation: 'none' }}>
                              Approve Access
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No employees registered.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div className="page-header">
                <h2>All Assigned Tasks</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.assignedTo?.name || 'Unknown'}</td>
                      <td>
                        <span className={`badge ${task.status === 'Completed' ? 'badge-completed' : task.status === 'In Progress' ? 'badge-progress' : 'badge-pending'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ color: new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'var(--danger)' : 'inherit' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                      </td>
                    </tr>
                  ))}
                   {tasks.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>🙌 No tasks active! Enjoy your free time.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'assign' && (
            <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
              <h2>Assign New Task</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Create and assign a task to an approved employee.</p>
              
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input type="text" className="form-input" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="4" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="form-input" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                    <option value="">Select Employee...</option>
                    {employees.filter(e => e.isApproved).map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline / Due Date</label>
                  <input type="date" className="form-input" value={newTaskDeadline} onChange={(e) => setNewTaskDeadline(e.target.value)} required style={newTaskDeadline ? {} : { color: 'var(--text-secondary)' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ animation: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} disabled={isSubmitting}>
                  {isSubmitting ? <span className="loader"></span> : 'Draft and Assign Task'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
