import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from "../services/firestore";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Função para buscar dados do usuário do Firestore
  const fetchUserData = useCallback(async (uid) => {
    console.log("[AuthContext] Buscando dados do usuário com UID:", uid);
    try {
      const { data, error } = await getUserData(uid);
      if (data) {
        console.log("[AuthContext] Dados do usuário carregados com sucesso:", data);
        setUserData(data);
        return data;
      } else {
        console.error("[AuthContext] Erro ao buscar dados do usuário:", error);
        setUserData(null);
        return null;
      }
    } catch (error) {
      console.error("[AuthContext] Exceção ao buscar dados do usuário:", error);
      setUserData(null);
      return null;
    }
  }, []);

  // Efeito para monitorar mudanças de autenticação
  useEffect(() => {
    console.log("[AuthContext] Configurando observador de autenticação");
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("[AuthContext] Estado de autenticação alterado:", currentUser ? `Usuário ${currentUser.uid} logado` : "Nenhum usuário logado");
      setUser(currentUser);
      
      if (currentUser && currentUser.uid) {
        // Busca os dados adicionais do usuário no Firestore
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log("[AuthContext] Limpando observador de autenticação");
      unsubscribe();
    };
  }, [fetchUserData]);

  // Função para recarregar os dados do usuário atual
  const refreshUserData = async () => {
    if (user && user.uid) {
      console.log("[AuthContext] Recarregando dados do usuário...");
      return await fetchUserData(user.uid);
    }
    return null;
  };

  // Valor do contexto
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

export const useAuth = () => {
  return useContext(AuthContext);
};