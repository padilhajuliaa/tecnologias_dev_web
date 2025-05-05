import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../config/firebase";

// Função para criar um novo usuário com e-mail e senha
export const registerWithEmailAndPassword = async (email, password) => {
  try {
    console.log("[Auth] Tentando criar novo usuário:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("[Auth] Usuário criado com sucesso, UID:", userCredential.user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("[Auth] Erro ao criar usuário:", error.code, error.message);
    return { user: null, error: error.message };
  }
};

// Função para fazer login com e-mail e senha
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    console.log("[Auth] Tentando fazer login:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("[Auth] Login realizado com sucesso, UID:", userCredential.user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("[Auth] Erro ao fazer login:", error.code, error.message);
    return { user: null, error: error.message };
  }
};

// Função para fazer logout
export const logout = async () => {
  try {
    console.log("[Auth] Tentando fazer logout");
    await signOut(auth);
    console.log("[Auth] Logout realizado com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[Auth] Erro ao fazer logout:", error.code, error.message);
    return { success: false, error: error.message };
  }
};