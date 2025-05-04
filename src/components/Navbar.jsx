import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/auth';
import '../styles/components.css';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ATP2 Firebase App</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/principal" className="navbar-item">Principal</Link>
            <button onClick={handleLogout} className="navbar-item logout-btn">
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/cadastro" className="navbar-item">Cadastro</Link>
            <Link to="/login" className="navbar-item">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;