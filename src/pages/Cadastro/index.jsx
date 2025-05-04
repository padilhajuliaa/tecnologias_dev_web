import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { registerWithEmailAndPassword } from '../../services/auth';
import { saveUserData } from '../../services/firestore';
import '../../styles/global.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    sobrenome: '',
    dataNascimento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Registra o usuário no Firebase Authentication
      const { user, error } = await registerWithEmailAndPassword(formData.email, formData.password);
      
      if (error) {
        throw new Error(error);
      }

      // Salva os dados complementares no Firestore
      const { nome, sobrenome, dataNascimento } = formData;
      const userData = {
        nome,
        sobrenome,
        dataNascimento,
        email: formData.email
      };

      const saveResult = await saveUserData(user.uid, userData);
      
      if (saveResult.error) {
        throw new Error(saveResult.error);
      }

      // Redireciona para a página principal após o cadastro
      navigate('/principal');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Usuário</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail"
          label="E-mail"
          required
        />
        
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Senha"
          label="Senha"
          required
        />
        
        <Input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome"
          label="Nome"
          required
        />
        
        <Input
          type="text"
          name="sobrenome"
          value={formData.sobrenome}
          onChange={handleChange}
          placeholder="Sobrenome"
          label="Sobrenome"
          required
        />
        
        <Input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          placeholder="Data de Nascimento"
          label="Data de Nascimento"
          required
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
      
      <div className="form-footer">
        <p>Já possui conta? <a href="/login">Faça login</a></p>
      </div>
    </div>
  );
};

export default Cadastro;