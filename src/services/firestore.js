import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../config/firebase";

// Coleção de usuários
const USERS_COLLECTION = "users";

// Função para salvar os dados do usuário no Firestore
export const saveUserData = async (uid, userData) => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, uid), {
      ...userData,
      createdAt: new Date(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Função para buscar os dados do usuário pelo uid
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: "Usuário não encontrado" };
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
};