import Navbar from "@/components/Navbar"
import UsernameForm from "@/components/UsernameForm"
import Button from "@/components/utils/Button"
import { IconSVGCode } from "@/components/utils/IconSVG"
import Sidebar from "@/components/Sidebar"
import { UserContext } from "@/contexts/User"
import { auth, googleAuthProvider } from "@/lib/firebase"
import { signInWithPopup } from "firebase/auth"
import { Inter } from "next/font/google"
import { useContext, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"

type Props = {
}

const inter = Inter({ subsets: ['latin'] })

const SignInWithGoogleButton = ({}:Props) => {

    const router = useRouter();
    const { user, username, logout } = useContext(UserContext);
    
    const signInWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth,googleAuthProvider)
            if(res.user){
                router.push(`/signin`)
            }
        } catch (error) {
            toast.error("Failed to log in with google")
        }
    }

    if(user){
        if(!username){
            return <UsernameForm />
        }else{
            return <p>Bienvenue {username}</p>
        }
    }else{
        return <Button text="Sign in with google" icon={IconSVGCode.google} onClick={signInWithGoogle} color={TailwindColor.blue}/>
    }
}



export default SignInWithGoogleButton