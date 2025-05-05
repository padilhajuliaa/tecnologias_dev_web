import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from "../services/firestore";

// Criação do contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Função para buscar os dados do usuário do Firestore
  const fetchUserData = async (uid) => {
    setAuthError(null);
    
    if (!uid) {
      setAuthError("UID não fornecido");
      return null;
    }
    
    try {
      const { data, error } = await getUserData(uid);
      
      if (error) {
        setAuthError(error);
      }
      
      if (data) {
        setUserData(data);
        return data;
      } else {
        setUserData(null);
        if (!authError) setAuthError(error || "Dados não encontrados");
        return null;
      }
    } catch (error) {
      setUserData(null);
      setAuthError(error.message || "Erro desconhecido ao buscar dados");
      return null;
    }
  };

  // Função para recarregar os dados do usuário
  const refreshUserData = async () => {
    if (user && user.uid) {
      return await fetchUserData(user.uid);
    } else {
      setAuthError("Usuário não autenticado");
      return null;
    }
  };

  // Observador de autenticação
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          await fetchUserData(currentUser.uid);
        } catch (dataError) {
          setAuthError(dataError.message);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Limpeza do observador quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  // Valor fornecido pelo contexto
  const value = {
    user,
    userData,
    loading,
    authError,
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