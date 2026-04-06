import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, LogOut, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useToast } from '../../components/Toast';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'employee') {
      navigate('/employee/login');
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employee/tasks`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employee/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if(res.ok) {
        showToast(`Task moved to ${newStatus}!`);
        fetchTasks();
      } else {
        showToast('Failed to update task', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar">
        <div className="navbar-brand">
          Xplore Intellects | Employee Interface
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Welcome, {userInfo?.name}</span>
          <button onClick={logout} className="btn-primary btn-small" style={{ display: 'flex', alignItems: 'center', gap: '8px', animation: 'none' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
        <div className="page-header">
          <h2><ListTodo size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '10px', color: 'var(--accent-cyan)' }} /> My Assigned Tasks</h2>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          {isLoading && tasks.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '40px' }}><span className="loader"></span></div>
          ) : tasks.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ opacity: 0.5, marginBottom: '20px' }} />
                <h3 style={{ color: 'var(--text-secondary)' }}>You're all caught up!</h3>
                <p style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>No tasks have been assigned to you yet.</p>
             </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td><div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.description}</div></td>
                    <td>
                      <span className={`badge ${task.status === 'Completed' ? 'badge-completed' : task.status === 'In Progress' ? 'badge-progress' : 'badge-pending'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ color: new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'var(--danger)' : 'inherit' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {updatingId === task._id ? <span className="loader"></span> : (
                          <>
                            {task.status !== 'In Progress' && task.status !== 'Completed' && (
                              <button onClick={() => handleUpdateStatus(task._id, 'In Progress')} className="btn-primary btn-small" style={{ animation: 'none' }}>Start Progress</button>
                            )}
                            {task.status !== 'Completed' && (
                              <button onClick={() => handleUpdateStatus(task._id, 'Completed')} className="btn-secondary btn-small" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>Mark Complete</button>
                            )}
                            {task.status !== 'Pending' && (
                              <button onClick={() => handleUpdateStatus(task._id, 'Pending')} className="btn-secondary btn-small">Set Pending</button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
