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
      console.log("[Cadastro] Iniciando processo de cadastro para:", formData.email);
      
      // Registra o usuário no Firebase Authentication
      const { user, error } = await registerWithEmailAndPassword(formData.email, formData.password);
      
      if (error) {
        console.error("[Cadastro] Erro na autenticação:", error);
        throw new Error(error);
      }
      
      console.log("[Cadastro] Usuário autenticado com sucesso, UID:", user.uid);

      // Salva os dados complementares no Firestore
      const { nome, sobrenome, dataNascimento } = formData;
      const userData = {
        nome,
        sobrenome,
        dataNascimento,
        email: formData.email
      };

      console.log("[Cadastro] Enviando dados para o Firestore:", userData);
      const saveResult = await saveUserData(user.uid, userData);
      
      if (saveResult.error) {
        console.error("[Cadastro] Erro ao salvar dados:", saveResult.error);
        throw new Error(saveResult.error);
      }
      
      console.log("[Cadastro] Dados salvos com sucesso!");

      // Tenta buscar os dados recém-salvos para garantir que tudo está correto
      console.log("[Cadastro] Verificando se os dados foram salvos corretamente...");
      await refreshUserData();
      
      console.log("[Cadastro] Redirecionando para a página principal...");
      setLoading(false);
      navigate('/principal');
      
    } catch (err) {
      console.error("[Cadastro] Erro no processo de cadastro:", err);
      setError(err.message || "Ocorreu um erro durante o cadastro. Tente novamente.");
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