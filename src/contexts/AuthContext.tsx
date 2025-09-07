import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { User } from "@/types/user";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  refetchUserProfile: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  refetchUserProfile: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: FirebaseUser) => {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const createdAtDate = (data.createdAt as Timestamp)?.toDate() || new Date();
      
      setUserProfile({
        ...data,
        createdAt: createdAtDate,
      } as User);
    } else {
      // Create profile for new user
      const newUserProfile: User = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
        postsCount: 0,
        profileComplete: false,
      };
      await setDoc(userDocRef, {
        id: newUserProfile.id,
        name: newUserProfile.name,
        email: newUserProfile.email,
        postsCount: 0,
        profileComplete: false,
        createdAt: serverTimestamp() 
      });
      setUserProfile(newUserProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refetchUserProfile = () => {
    if (currentUser) {
      fetchUserProfile(currentUser);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    refetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};