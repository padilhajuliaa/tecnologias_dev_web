import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Configuração do Firebase com variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Habilitando persistência para melhorar a experiência offline
// Isso também pode ajudar em problemas de conexão
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firebase - Persistência offline habilitada com sucesso");
    })
    .catch((err) => {
      console.error("Firebase - Erro ao habilitar persistência:", err);
      if (err.code === 'failed-precondition') {
        console.warn("Firebase - Múltiplas abas abertas. Persistência habilitada em apenas uma aba.");
      } else if (err.code === 'unimplemented') {
        console.warn("Firebase - Navegador não suporta persistência offline.");
      }
    });
} catch (error) {
  console.error("Firebase - Exceção ao configurar persistência:", error);
}

export default app;