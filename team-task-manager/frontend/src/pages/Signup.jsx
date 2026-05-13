import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-6 shadow-xl shadow-indigo-200 -rotate-3">T</div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create account</h2>
          <p className="text-slate-500 font-medium mt-2">Join TaskFlow to start collaborating</p>
        </div>

        <div className="glass-card p-10 rounded-3xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100 animate-in shake duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="John Doe"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="name@company.com"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Join as</label>
                <select
                  name="role"
                  className="input-field appearance-none cursor-pointer"
                  onChange={handleChange}
                  value={formData.role}
                >
                  <option value="Member">Team Member</option>
                  <option value="Admin">Team Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : 'Get Started'}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-100 text-center text-sm font-medium">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
