import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/global.css';

const Principal = () => {
  const { user, userData, loading, refreshUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quando a página carrega, tenta buscar os dados do usuário novamente
  useEffect(() => {
    const loadUserData = async () => {
      if (user && !userData) {
        setIsRefreshing(true);
        console.log("Tentando buscar dados novamente na Principal");
        await refreshUserData();
        setIsRefreshing(false);
      }
    };

    loadUserData();
  }, [user, userData, refreshUserData]);

  // Redireciona para o login se não estiver autenticado
  if (!loading && !user) {
    console.log("Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" />;
  }

  // Mostra mensagem de carregamento enquanto os dados estão sendo buscados
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
      console.error('Erro ao formatar data:', error);
      return dataString || 'Não informado';
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshUserData();
    setIsRefreshing(false);
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