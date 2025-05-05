import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from "../services/firestore";

// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do usuário do Firestore
  const fetchUserData = async (uid) => {
    console.log("AuthContext - Buscando dados do usuário:", uid);
    
    if (!uid) {
      console.error("AuthContext - UID não fornecido para fetchUserData");
      return null;
    }
    
    try {
      const { data, error } = await getUserData(uid);
      
      if (data) {
        console.log("AuthContext - Dados encontrados:", data);
        setUserData(data);
        return data;
      } else {
        console.error("AuthContext - Nenhum dado encontrado:", error);
        setUserData(null);
        return null;
      }
    } catch (error) {
      console.error("AuthContext - Exceção ao buscar dados:", error);
      setUserData(null);
      return null;
    }
  };

  // Função para recarregar os dados do usuário - exportada para outros componentes
  const refreshUserData = async () => {
    if (user && user.uid) {
      console.log("AuthContext - Atualizando dados do usuário:", user.uid);
      return await fetchUserData(user.uid);
    } else {
      console.log("AuthContext - Não é possível atualizar: usuário não autenticado");
      return null;
    }
  };

  // Observador de autenticação - executa quando o componente é montado
  useEffect(() => {
    console.log("AuthContext - Inicializando observador de autenticação");
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("AuthContext - Estado de autenticação alterado:", 
                 currentUser ? `Usuário logado: ${currentUser.uid}` : "Nenhum usuário logado");
      
      setUser(currentUser);
      
      if (currentUser) {
        // Quando um usuário é detectado, buscamos seus dados
        await fetchUserData(currentUser.uid);
      } else {
        // Quando não há usuário, limpamos os dados
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Limpeza do observador quando o componente é desmontado
    return () => {
      console.log("AuthContext - Removendo observador de autenticação");
      unsubscribe();
    };
  }, []); // Dependência vazia para executar apenas na montagem

  // Valor fornecido pelo contexto
  const value = {
    user,
    userData,
    loading,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para utilizar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};