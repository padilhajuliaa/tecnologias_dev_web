import { 
  doc, 
  getDoc, 
  setDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../config/firebase";

// Coleção de usuários
const USERS_COLLECTION = "users";

/**
 * Salva os dados do usuário no Firestore
 * Esta função foi completamente reescrita para garantir a persistência correta dos dados
 */
export const saveUserData = async (uid, userData) => {
  try {
    console.log("SaveUserData - Iniciando para UID:", uid);
    
    // Dados para serem salvos - formatados para garantir compatibilidade com Firestore
    const dataToSave = {
      nome: userData.nome || "",
      sobrenome: userData.sobrenome || "",
      email: userData.email || "",
      dataNascimento: userData.dataNascimento || "",
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };
    
    console.log("SaveUserData - Dados formatados:", dataToSave);
    
    // Usando setDoc diretamente com o UID como ID do documento
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, dataToSave);
    
    console.log("SaveUserData - Dados salvos com sucesso!");
    return { success: true, error: null };
  } catch (error) {
    console.error("SaveUserData - Erro:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Busca os dados do usuário no Firestore
 * Esta função foi completamente reescrita para garantir a recuperação correta dos dados
 */
export const getUserData = async (uid) => {
  try {
    console.log("GetUserData - Iniciando para UID:", uid);
    
    if (!uid) {
      console.error("GetUserData - UID não fornecido");
      return { data: null, error: "UID não fornecido" };
    }
    
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("GetUserData - Dados encontrados:", data);
      
      return { 
        data: {
          id: uid,
          nome: data.nome || "",
          sobrenome: data.sobrenome || "",
          email: data.email || "",
          dataNascimento: data.dataNascimento || "",
          createdAt: data.createdAt || null
        }, 
        error: null 
      };
    } else {
      console.log("GetUserData - Nenhum documento encontrado");
      return { data: null, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("GetUserData - Erro:", error);
    return { data: null, error: error.message };
  }
};