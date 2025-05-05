import { 
  doc, 
  getDoc, 
  setDoc,
  Timestamp,
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "../config/firebase";

// Coleção de usuários
const USERS_COLLECTION = "users";

/**
 * Salva os dados do usuário no Firestore
 */
export const saveUserData = async (uid, userData) => {
  try {
    console.log("SaveUserData - Config do Firebase:", {
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "Não definido"
    });
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
    
    // Verificação adicional para confirmar que os dados foram salvos
    const docSnap = await getDoc(docRef);
    console.log("SaveUserData - Verificação pós-salvamento:", docSnap.exists() 
      ? "Documento salvo com sucesso" 
      : "Documento não encontrado após salvamento");
    
    console.log("SaveUserData - Dados salvos com sucesso!");
    return { success: true, error: null };
  } catch (error) {
    console.error("SaveUserData - Erro:", error);
    console.error("SaveUserData - Código de erro:", error.code);
    console.error("SaveUserData - Mensagem de erro:", error.message);
    
    // Tentando listar todas as coleções para verificar acesso
    try {
      console.log("SaveUserData - Tentando listar documentos para verificar permissões");
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      console.log("SaveUserData - Número de documentos encontrados:", querySnapshot.size);
    } catch (listError) {
      console.error("SaveUserData - Erro ao listar documentos:", listError);
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Busca os dados do usuário no Firestore
 */
export const getUserData = async (uid) => {
  try {
    console.log("GetUserData - Iniciando para UID:", uid);
    console.log("GetUserData - Coletando dados da coleção:", USERS_COLLECTION);
    
    if (!uid) {
      console.error("GetUserData - UID não fornecido");
      return { data: null, error: "UID não fornecido" };
    }
    
    const docRef = doc(db, USERS_COLLECTION, uid);
    console.log("GetUserData - Referência do documento criada:", docRef.path);
    
    const docSnap = await getDoc(docRef);
    console.log("GetUserData - Documento existe?", docSnap.exists());
    
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
      
      // Tentando listar documentos para debug
      try {
        console.log("GetUserData - Listando todos os documentos para debug");
        const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
        console.log("GetUserData - Total de documentos:", querySnapshot.size);
        querySnapshot.forEach(doc => {
          console.log("GetUserData - Documento encontrado:", doc.id);
        });
      } catch (listError) {
        console.error("GetUserData - Erro ao listar documentos:", listError);
      }
      
      return { data: null, error: "Usuário não encontrado" };
    }
  } catch (error) {
    console.error("GetUserData - Erro:", error);
    console.error("GetUserData - Código de erro:", error.code);
    console.error("GetUserData - Mensagem de erro:", error.message);
    return { data: null, error: error.message };
  }
};