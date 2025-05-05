import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Principal = () => {
  const { user, userData, loading, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Buscar dados do usuário ao carregar a página
  useEffect(() => {
    if (user && !userData && !refreshing) {
      const loadData = async () => {
        setRefreshing(true);
        await refreshUserData();
        setRefreshing(false);
      };
      loadData();
    }
  }, [user, userData, refreshUserData, refreshing]);

  // Redirecionar para login se não estiver autenticado
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Exibir mensagem de carregamento
  if (loading || refreshing) {
    return <div className="container loading">Carregando dados...</div>;
  }

  // Função para formatar a data
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    
    try {
      const data = new Date(dataString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(data);
    } catch (error) {
      return dataString || 'Não informado';
    }
  };

  return (
    <div className="container">
      <h1>Página Principal</h1>
      
      <div className="user-profile">
        <h2>Dados do Usuário</h2>
        
        {userData ? (
          // Exibe os dados do usuário se estiverem disponíveis
          <div className="user-data">
            <p><strong>Nome:</strong> {userData.nome || 'Não informado'}</p>
            <p><strong>Sobrenome:</strong> {userData.sobrenome || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> {formatarData(userData.dataNascimento)}</p>
            <p><strong>E-mail:</strong> {userData.email || user?.email || 'Não informado'}</p>
          </div>
        ) : (
          // Exibe mensagem se os dados não estiverem disponíveis
          <div className="user-data error">
            <p>Nenhum dado encontrado para este usuário.</p>
            <p>Por favor, verifique se você completou seu cadastro corretamente.</p>
            {user && <p><strong>E-mail autenticado:</strong> {user.email}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Principal;