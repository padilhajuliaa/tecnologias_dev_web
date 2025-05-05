import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Principal = () => {
  const { user, userData, loading, refreshUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para tentar recarregar os dados do usuário
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setIsRefreshing(false);
  };

  // Redireciona para o login se não estiver autenticado
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Mostra mensagem de carregamento
  if (loading || isRefreshing) {
    return <div className="container loading">Carregando dados do usuário...</div>;
  }

  // Formata a data de nascimento
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
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
          <div className="user-data">
            <p><strong>Nome:</strong> {userData.nome || 'Não informado'}</p>
            <p><strong>Sobrenome:</strong> {userData.sobrenome || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> {formatarData(userData.dataNascimento)}</p>
            <p><strong>E-mail:</strong> {userData.email || user?.email || 'Não informado'}</p>
          </div>
        ) : (
          <div className="user-data error">
            <p>Nenhum dado encontrado para este usuário.</p>
            <p>Por favor, verifique se você completou seu cadastro corretamente.</p>
            {user && <p><strong>E-mail autenticado:</strong> {user.email}</p>}
            
            <button 
              className="refresh-button" 
              onClick={handleRefreshData} 
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Principal;