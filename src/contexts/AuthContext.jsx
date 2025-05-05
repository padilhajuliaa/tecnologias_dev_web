import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserData } from "../services/firestore";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Função para buscar dados do usuário do Firestore
  const fetchUserData = useCallback(async (uid) => {
    console.log("Buscando dados do usuário com UID:", uid);
    try {
      const { data, error } = await getUserData(uid);
      if (data) {
        console.log("Dados do usuário obtidos com sucesso:", data);
        setUserData(data);
        return data;
      } else {
        console.error("Erro ao buscar dados do usuário:", error);
        setUserData(null);
        return null;
      }
    } catch (error) {
      console.error("Exceção ao buscar dados do usuário:", error);
      setUserData(null);
      return null;
    }
  }, []);

  // Efeito para monitorar mudanças de autenticação
  useEffect(() => {
    console.log("Configurando observador de autenticação");
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Estado de autenticação alterado:", currentUser ? `Usuário ${currentUser.uid} logado` : "Nenhum usuário logado");
      setUser(currentUser);
      
      if (currentUser) {
        // Busca os dados adicionais do usuário no Firestore
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log("Limpando observador de autenticação");
      unsubscribe();
    };
  }, [fetchUserData]);

  // Função para fazer cadastro
  const signup = async (email, password) => {
    try {
      console.log("Iniciando cadastro com email:", email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Cadastro realizado com sucesso");
      return { user: result.user, error: null };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { user: null, error: error.message };
    }
  };

  // Função para fazer login
  const login = async (email, password) => {
    try {
      console.log("Iniciando login com email:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login realizado com sucesso");
      
      // Buscando dados do usuário após login bem-sucedido
      await fetchUserData(result.user.uid);
      
      return { user: result.user, error: null };
    } catch (error) {
      console.error("Erro no login:", error);
      return { user: null, error: error.message };
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Logout realizado com sucesso");
      setUserData(null);
      return { success: true, error: null };
    } catch (error) {
      console.error("Erro no logout:", error);
      return { success: false, error: error.message };
    }
  };

  // Função para recarregar os dados do usuário atual
  const refreshUserData = async () => {
    if (user && user.uid) {
      console.log("Recarregando dados do usuário...");
      return await fetchUserData(user.uid);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      signup, 
      login, 
      logout,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};