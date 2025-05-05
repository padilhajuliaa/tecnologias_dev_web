import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserData } from '../../services/firestore';
import '../../styles/global.css';

const Principal = () => {
  const { user, userData: contextUserData, loading } = useAuth();
  const [localUserData, setLocalUserData] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Efeito para buscar dados do usuário caso não estejam disponíveis no contexto
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid && !contextUserData) {
        setLocalLoading(true);
        try {
          console.log('Buscando dados do usuário do Firestore...');
          const { data, error } = await getUserData(user.uid);
          if (data) {
            console.log('Dados do usuário encontrados:', data);
            setLocalUserData(data);
          } else if (error) {
            console.error('Erro ao buscar dados:', error);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLocalLoading(false);
        }
      } else if (contextUserData) {
        console.log('Usando dados do usuário do contexto:', contextUserData);
      }
    };

    fetchUserData();
  }, [user, contextUserData]);

  // Redireciona para o login se não estiver autenticado
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  // Mostra mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading || localLoading) {
    return <div className="container loading">Carregando dados do usuário...</div>;
  }

  // Usa os dados do contexto ou os dados locais (fallback)
  const displayUserData = contextUserData || localUserData;

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

  return (
    <div className="container">
      <h1>Página Principal</h1>
      <div className="user-profile">
        <h2>Dados do Usuário</h2>
        {displayUserData ? (
          <div className="user-data">
            <p><strong>Nome:</strong> {displayUserData.nome || 'Não informado'}</p>
            <p><strong>Sobrenome:</strong> {displayUserData.sobrenome || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> {formatarData(displayUserData.dataNascimento)}</p>
            <p><strong>E-mail:</strong> {displayUserData.email || user?.email || 'Não informado'}</p>
          </div>
        ) : (
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