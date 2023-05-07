import { createContext, useEffect, useState } from 'react'
import { User as FireUser } from "firebase/auth";
import { auth, firestore } from '@/lib/firebase';
import { AuthStateHook, useAuthState } from "react-firebase-hooks/auth"
import { doc, onSnapshot } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

type UserContextType = {
    user: FireUser | null
    username: string | null
    logout:()=>void
}

type Props = {children: React.ReactNode;};

export const UserContext = createContext<UserContextType>({
    user: null,
    username:"",
    logout:()=>{}
})

export function UserProvider({ children }: Props) {

    const router = useRouter();
    const [ authUser ] = useAuthState(auth)
    const [ user, setUser ] = useState<FireUser | null>(null)
    const [ username, setUsername ] = useState<string | null>(null)

    useEffect(() => {
        // turn off realtime subscription
        let unsubscribe;
        if (authUser) {
            setUser(authUser)
            const ref = doc(firestore, 'users', authUser.uid);
            unsubscribe = onSnapshot(ref, (doc) => {
                setUsername(doc.data()?.username)
            });
        } else {
          setUsername(null);
          setUser(null)
        }
        return unsubscribe;
    },[authUser])

    const logout = () => {
        auth.signOut()
        router.push("/")
    }
    const value = {
        user,
        username,
        logout
    };
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}