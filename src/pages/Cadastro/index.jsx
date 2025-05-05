import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { registerWithEmailAndPassword } from '../../services/auth';
import { saveUserData } from '../../services/firestore';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
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
      console.log("Cadastro - Iniciando cadastro para:", formData.email);
      
      // 1. Registrar usuário na autenticação do Firebase
      const { user, error: authError } = await registerWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      if (authError) {
        console.error("Cadastro - Erro na autenticação:", authError);
        throw new Error(authError);
      }
      
      console.log("Cadastro - Usuário criado com sucesso. UID:", user.uid);
      
      // 2. Salvar dados adicionais no Firestore
      const userData = {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        dataNascimento: formData.dataNascimento,
        email: formData.email
      };
      
      console.log("Cadastro - Salvando dados no Firestore:", userData);
      const { success, error: firestoreError } = await saveUserData(user.uid, userData);
      
      if (!success) {
        console.error("Cadastro - Erro ao salvar dados:", firestoreError);
        throw new Error(firestoreError || "Erro ao salvar seus dados");
      }
      
      console.log("Cadastro - Dados salvos com sucesso!");
      
      // 3. Atualizar o contexto de autenticação com os novos dados
      console.log("Cadastro - Atualizando contexto com os dados do usuário");
      await refreshUserData();
      
      // 4. Redirecionar para a página principal
      console.log("Cadastro - Redirecionando para página principal");
      navigate('/principal');
    } catch (err) {
      console.error("Cadastro - Erro durante o processo:", err);
      setError(err.message || "Ocorreu um erro durante o cadastro");
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