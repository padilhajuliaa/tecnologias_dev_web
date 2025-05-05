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
 */
export const saveUserData = async (uid, userData) => {
  try {
    // Dados para serem salvos
    const dataToSave = {
      nome: userData.nome || "",
      sobrenome: userData.sobrenome || "",
      email: userData.email || "",
      dataNascimento: userData.dataNascimento || "",
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };
    
    // Salvando no Firestore
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, dataToSave);
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao salvar dados do usuário:", error);
    return { success: false, error: error.message || "Erro ao salvar dados" };
  }
};

/**
 * Busca os dados do usuário no Firestore
 */
export const getUserData = async (uid) => {
  try {
    if (!uid) {
      return { data: null, error: "UID não fornecido" };
    }
    
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Formatando a saída
      const formattedData = {
        id: uid,
        nome: data.nome || "",
        sobrenome: data.sobrenome || "",
        email: data.email || "",
        dataNascimento: data.dataNascimento || "",
        createdAt: data.createdAt || null
      };
      
      return { data: formattedData, error: null };
    } else {
      return { data: null, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return { data: null, error: error.message || "Erro ao buscar dados" };
  }
};