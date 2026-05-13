import { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    tasksByStatus: { 'Pending': 0, 'In Progress': 0, 'Completed': 0 },
    overdueTasks: 0,
    tasksPerUser: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-slate-500 font-medium">Here's what's happening with your projects today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon="📋" color="indigo" />
        <StatCard title="In Progress" value={stats.tasksByStatus['In Progress'] || 0} icon="⚡" color="yellow" />
        <StatCard title="Completed" value={stats.tasksByStatus['Completed'] || 0} icon="✅" color="green" />
        <StatCard title="Overdue" value={stats.overdueTasks} icon="🚨" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Task Overview</h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Tasks
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => {
              const height = stats.totalTasks ? (count / stats.totalTasks) * 100 : 0;
              return (
                <div key={status} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full bg-slate-50 rounded-xl relative group overflow-hidden h-48">
                    <div 
                      style={{ height: `${height}%` }}
                      className={`absolute bottom-0 w-full transition-all duration-1000 ease-out rounded-t-lg ${
                        status === 'Completed' ? 'bg-green-500' : status === 'In Progress' ? 'bg-yellow-500' : 'bg-indigo-500'
                      }`}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Team Performance</h2>
          {user.role === 'Admin' ? (
            <div className="space-y-6">
              {stats.tasksPerUser.length > 0 ? stats.tasksPerUser.map((u, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{u.name}</span>
                    <span className="text-xs font-black text-slate-400">{u.count} tasks</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(u.count / (stats.totalTasks || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">👥</div>
                  <p className="text-slate-400 text-sm font-medium">No team activity yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-slate-600 font-medium">Focus on your assigned tasks to help the team reach the goal!</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 glass-card rounded-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity Log</h2>
        <div className="space-y-4">
          {stats.activities.length > 0 ? stats.activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                activity.type === 'Login' ? 'bg-blue-100' : 
                activity.type === 'Project' ? 'bg-purple-100' : 
                activity.type === 'Task' ? 'bg-amber-100' : 'bg-emerald-100'
              }`}>
                {activity.type === 'Login' ? '🔑' : activity.type === 'Project' ? '📁' : activity.type === 'Task' ? '📝' : '👥'}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-900">{activity.action}</p>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  by <span className="text-indigo-600 font-bold">{activity.user?.name || 'System'}</span>
                </p>
              </div>
            </div>
          )) : (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm font-medium">No activity recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    indigo: 'border-indigo-500 text-indigo-600 bg-indigo-50',
    yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50',
    green: 'border-green-500 text-green-600 bg-green-50',
    red: 'border-red-500 text-red-600 bg-red-50',
  };

  return (
    <div className={`glass-card p-6 rounded-2xl border-l-4 ${colors[color]} hover:scale-[1.02] transition-all cursor-default`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-black uppercase tracking-widest opacity-60">{title}</span>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
};

export default Dashboard;
