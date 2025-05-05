import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebase";

// Coleção de usuários
const USERS_COLLECTION = "users";

// Função para salvar os dados do usuário no Firestore
export const saveUserData = async (uid, userData) => {
  try {
    console.log("saveUserData iniciado para UID:", uid);
    
    // Sanitizando os dados para garantir compatibilidade com o Firestore
    const sanitizedData = {
      ...userData,
      createdAt: serverTimestamp(), // Usando serverTimestamp para consistência
      updatedAt: serverTimestamp()
    };
    
    // Convertendo a data de nascimento para string se for um objeto Date
    if (sanitizedData.dataNascimento instanceof Date) {
      sanitizedData.dataNascimento = sanitizedData.dataNascimento.toISOString();
    }
    
    console.log("Dados sanitizados:", sanitizedData);
    
    // Usando setDoc com merge:true para preservar dados existentes
    await setDoc(doc(db, USERS_COLLECTION, uid), sanitizedData, { merge: true });
    console.log("Dados salvos com sucesso no Firestore");
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao salvar dados no Firestore:", error);
    return { success: false, error: error.message };
  }
};

// Função para buscar os dados do usuário pelo uid
export const getUserData = async (uid) => {
  try {
    console.log("getUserData iniciado para UID:", uid);
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const userData = { id: docSnap.id, ...docSnap.data() };
      console.log("Dados do usuário encontrados:", userData);
      return { data: userData, error: null };
    } else {
      console.log("Nenhum documento encontrado para o UID:", uid);
      return { data: null, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("Erro ao buscar dados do Firestore:", error);
    return { data: null, error: error.message };
  }
};