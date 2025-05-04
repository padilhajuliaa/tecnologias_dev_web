import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { loginWithEmailAndPassword } from '../../services/auth';
import '../../styles/global.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, error } = await loginWithEmailAndPassword(email, password);
      
      if (error) {
        throw new Error(error);
      }

      // Redireciona para a página principal após o login
      navigate('/principal');
    } catch (err) {
      setError('Usuário não cadastrado ou senha incorreta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          label="E-mail"
          required
        />
        
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          label="Senha"
          required
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      
      <div className="form-footer">
        <p>Não possui conta? <a href="/cadastro">Cadastre-se</a></p>
      </div>
    </div>
  );
};

export default Login;