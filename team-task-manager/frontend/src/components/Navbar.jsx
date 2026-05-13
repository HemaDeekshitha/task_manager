import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">T</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-600">TaskFlow</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/projects') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-slate-900">{user.name}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
