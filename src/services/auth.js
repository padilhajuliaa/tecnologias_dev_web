import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../config/firebase";

/**
 * Cria um novo usuário com e-mail e senha
 */
export const registerWithEmailAndPassword = async (email, password) => {
  try {
    console.log("Auth - Iniciando registro de usuário:", email);
    
    if (!email || !password) {
      console.error("Auth - E-mail ou senha não fornecidos");
      return { user: null, error: "E-mail e senha são obrigatórios" };
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Auth - Usuário registrado com sucesso. UID:", userCredential.user.uid);
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Auth - Erro ao registrar usuário:", error.code, error.message);
    
    // Tratando erros específicos de forma amigável
    let errorMessage = "Erro ao criar conta. Tente novamente.";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Este e-mail já está sendo usado por outra conta.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "O e-mail fornecido não é válido.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
    }
    
    return { user: null, error: errorMessage };
  }
};

/**
 * Faz login com e-mail e senha
 */
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    console.log("Auth - Iniciando login:", email);
    
    if (!email || !password) {
      console.error("Auth - E-mail ou senha não fornecidos");
      return { user: null, error: "E-mail e senha são obrigatórios" };
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Auth - Login realizado com sucesso. UID:", userCredential.user.uid);
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Auth - Erro ao fazer login:", error.code, error.message);
    
    // Tratando erros específicos de forma amigável
    let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = "E-mail ou senha incorretos.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "O e-mail fornecido não é válido.";
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = "Esta conta foi desativada.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
    }
    
    return { user: null, error: errorMessage };
  }
};

/**
 * Faz logout do usuário atual
 */
export const logout = async () => {
  try {
    console.log("Auth - Iniciando logout");
    await signOut(auth);
    console.log("Auth - Logout realizado com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("Auth - Erro ao fazer logout:", error.code, error.message);
    return { success: false, error: "Não foi possível fazer logout. Tente novamente." };
  }
};