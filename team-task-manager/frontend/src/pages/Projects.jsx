import { useEffect, useState } from 'react';
import api from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProjects();
    if (user.role === 'Admin') fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      if (selectedProject) {
        const updated = data.find(p => p.id === selectedProject.id);
        if (updated) setSelectedProject(updated);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowProjectModal(false);
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${selectedProject.id}/members`, { userId: selectedMemberId });
      setSelectedMemberId('');
      setShowMemberModal(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${selectedProject.id}/members/${userId}`);
      fetchProjects();
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: selectedProject.id });
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
      setShowTaskModal(false);
      fetchTasks(selectedProject.id);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchTasks(selectedProject.id);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks(selectedProject.id);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    fetchTasks(project.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {selectedProject ? selectedProject.name : 'Projects'}
          </h1>
          {selectedProject && (
            <p className="text-slate-500 font-medium mt-1">{selectedProject.description}</p>
          )}
        </div>
        
        <div className="flex gap-3">
          {selectedProject && (
            <button
              onClick={() => setSelectedProject(null)}
              className="btn-secondary"
            >
              Back
            </button>
          )}
          {user.role === 'Admin' && !selectedProject && (
            <button
              onClick={() => setShowProjectModal(true)}
              className="btn-primary"
            >
              Create Project
            </button>
          )}
          {user.role === 'Admin' && selectedProject && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="btn-secondary"
            >
              Team
            </button>
          )}
          {user.role === 'Admin' && selectedProject && (
            <button
              onClick={() => setShowTaskModal(true)}
              className="btn-primary"
            >
              New Task
            </button>
          )}
        </div>
      </div>

      {!selectedProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? projects.map((project) => (
            <div
              key={project.id}
              onClick={() => selectProject(project)}
              className="glass-card p-8 rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  📁
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{project.description || 'No description provided.'}</p>
              
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 3).map((m, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold" title={m.name}>
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {project.members?.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400">By {project.creator?.name.split(' ')[0]}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center glass-card rounded-2xl border-dashed border-2">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to start?</h3>
              <p className="text-slate-500 mb-8">Create your first project to begin managing tasks.</p>
              {user.role === 'Admin' && (
                <button onClick={() => setShowProjectModal(true)} className="btn-primary">Create Project</button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Task Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Assignee</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.length > 0 ? tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 mb-1">{task.title}</div>
                      <div className="text-xs text-slate-500 max-w-xs truncate">{task.description}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {task.assignee?.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{task.assignee?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                          className="text-xs font-bold text-indigo-600 bg-indigo-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer hover:bg-indigo-100 transition-colors outline-none appearance-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">Working</option>
                          <option value="Completed">Done</option>
                        </select>
                        {user.role === 'Admin' && (
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Task"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-slate-400 font-medium">No tasks found for this project.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal show={showProjectModal} onClose={() => setShowProjectModal(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Project Name</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Q3 Marketing Campaign"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
            <textarea
              className="input-field min-h-[120px]"
              placeholder="What's this project about?"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowProjectModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Project</button>
          </div>
        </form>
      </Modal>

      <Modal show={showMemberModal} onClose={() => setShowMemberModal(false)} title="Manage Team">
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Current Team</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {selectedProject?.members.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold border border-slate-200">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{m.name}</div>
                      <div className="text-[10px] font-bold text-slate-400">{m.email}</div>
                    </div>
                  </div>
                  {m.id !== selectedProject.createdBy && (
                    <button 
                      onClick={() => handleRemoveMember(m.id)}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddMember} className="pt-6 border-t border-slate-100">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Add Team Member</label>
            <div className="flex gap-2">
              <select
                required
                className="input-field"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="">Select a user...</option>
                {users
                  .filter(u => !selectedProject?.members.some(m => m.id === u.id))
                  .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                }
              </select>
              <button type="submit" disabled={!selectedMemberId} className="btn-primary whitespace-nowrap">Add</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal show={showTaskModal} onClose={() => setShowTaskModal(false)} title="New Task">
        <form onSubmit={handleCreateTask} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Task Title</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="What needs to be done?"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Assign To</label>
            <select
              required
              className="input-field"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            >
              <option value="">Select Team Member</option>
              {selectedProject?.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Due Date</label>
              <input
                type="date"
                required
                className="input-field"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Priority</label>
              <select
                className="input-field"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="glass-card bg-white rounded-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold transition-colors">✕</button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${styles[status] || styles['Pending']}`}>
      {status === 'In Progress' ? 'Working' : status}
    </span>
  );
};

export default Projects;
