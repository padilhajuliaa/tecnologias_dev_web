import { 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../config/firebase";

// Coleção de usuários
const USERS_COLLECTION = "users";

// Função para salvar os dados do usuário no Firestore
export const saveUserData = async (uid, userData) => {
  try {
    console.log("[Firestore] Iniciando salvamento de dados para UID:", uid);
    
    // Valores padrão para campos que podem estar faltando
    const dataToSave = {
      nome: userData.nome || "",
      sobrenome: userData.sobrenome || "",
      dataNascimento: userData.dataNascimento || "",
      email: userData.email || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log("[Firestore] Dados a serem salvos:", dataToSave);
    
    // Usando uma função mais direta para garantir que os dados são salvos
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, dataToSave);
    
    console.log("[Firestore] Dados salvos com sucesso!");
    return { success: true, error: null };
  } catch (error) {
    console.error("[Firestore] Erro ao salvar dados:", error);
    return { success: false, error: error.message };
  }
};

// Função para buscar os dados do usuário pelo uid
export const getUserData = async (uid) => {
  try {
    console.log("[Firestore] Buscando dados para UID:", uid);
    
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("[Firestore] Dados encontrados:", data);
      
      // Construindo objeto com todos os campos necessários
      const userData = {
        id: docSnap.id,
        nome: data.nome || "",
        sobrenome: data.sobrenome || "",
        dataNascimento: data.dataNascimento || "",
        email: data.email || "",
        createdAt: data.createdAt || null
      };
      
      return { data: userData, error: null };
    } else {
      console.log("[Firestore] Nenhum documento encontrado para o UID:", uid);
      return { data: null, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("[Firestore] Erro ao buscar dados:", error);
    return { data: null, error: error.message };
  }
};