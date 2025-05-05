import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Principal = () => {
  const { user, userData, loading, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAttempt, setRefreshAttempt] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(false);

  // Tentar carregar os dados do usuário se eles não estiverem disponíveis no primeiro carregamento
  useEffect(() => {
    const loadData = async () => {
      // Se o usuário está autenticado mas não temos seus dados, tenta buscá-los
      if (user && !userData && !refreshing && refreshAttempt < 3) {
        console.log("Principal - Tentativa", refreshAttempt + 1, "de buscar dados automaticamente");
        setRefreshing(true);
        await refreshUserData();
        setRefreshing(false);
        setRefreshAttempt(prev => prev + 1);
      }
    };

    loadData();
  }, [user, userData, refreshUserData, refreshing, refreshAttempt]);

  // Este efeito é executado apenas uma vez quando o componente é montado
  // para garantir que os dados sejam atualizados mesmo se já existirem
  useEffect(() => {
    const initialLoad = async () => {
      if (user && !manualRefresh) {
        console.log("Principal - Atualizando dados na montagem do componente");
        setRefreshing(true);
        await refreshUserData();
        setRefreshing(false);
        setManualRefresh(true);
      }
    };

    initialLoad();
  }, [user, refreshUserData]);

  // Handler para o botão de atualizar dados
  const handleRefreshData = async () => {
    console.log("Principal - Botão de atualização clicado");
    setRefreshing(true);
    setManualRefresh(true);
    await refreshUserData();
    setRefreshing(false);
  };

  // Redirecionar para login se não estiver autenticado
  if (!loading && !user) {
    console.log("Principal - Usuário não autenticado, redirecionando para login");
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
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return data.toLocaleDateString('pt-BR', options);
    } catch (error) {
      console.error("Principal - Erro ao formatar data:", error);
      return dataString || 'Não informado';
    }
  };

  // Debug information to help troubleshoot issues
  console.log("Principal - Estado atual:", {
    userExists: !!user,
    userDataExists: !!userData,
    uid: user?.uid,
    email: user?.email
  });

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
            
            <button 
              className="refresh-button" 
              onClick={handleRefreshData} 
              disabled={refreshing}
            >
              {refreshing ? 'Atualizando...' : 'Atualizar dados'}
            </button>
          </div>
        ) : (
          // Exibe mensagem de erro se os dados não estiverem disponíveis
          <div className="user-data error">
            <p>Nenhum dado encontrado para este usuário.</p>
            <p>Por favor, verifique se você completou seu cadastro corretamente.</p>
            {user && <p><strong>E-mail autenticado:</strong> {user.email}</p>}
            
            <button 
              className="refresh-button" 
              onClick={handleRefreshData} 
              disabled={refreshing}
            >
              {refreshing ? 'Atualizando...' : 'Atualizar dados'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Principal;