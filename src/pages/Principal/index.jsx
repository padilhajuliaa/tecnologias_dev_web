import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '../../services/firestore';
import '../../styles/global.css';

const Principal = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        setLoadingData(true);
        try {
          const { data, error } = await getUserData(user.uid);
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLoadingData(false);
        }
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoadingData(false);
    }
  }, [user]);

  // Redireciona para o login se não estiver autenticado
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Mostra mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading || loadingData) {
    return <div className="container loading">Carregando...</div>;
  }

  // Formata a data de nascimento
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="container">
      <h1>Página Principal</h1>
      <div className="user-profile">
        <h2>Dados do Usuário</h2>
        {userData ? (
          <div className="user-data">
            <p><strong>Nome:</strong> {userData.nome}</p>
            <p><strong>Sobrenome:</strong> {userData.sobrenome}</p>
            <p><strong>Data de Nascimento:</strong> {formatarData(userData.dataNascimento)}</p>
            <p><strong>E-mail:</strong> {userData.email}</p>
          </div>
        ) : (
          <p>Nenhum dado encontrado para este usuário.</p>
        )}
      </div>
    </div>
  );
};

export default Principal;