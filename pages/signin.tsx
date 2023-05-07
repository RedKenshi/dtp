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

const SignIn = ({}:Props) => {

    const router = useRouter();
    const { user, username } = useContext(UserContext);
    
    const SignInButton = useMemo(() => {
        const signInWithGoogle = async () => {
            try {
                const res = await signInWithPopup(auth,googleAuthProvider)
                if(res.user){
                    router.push(`/`)
                }
            } catch (error) {
                toast.error("Failed to log in with google")
            }
        }
        return (
            <Button text="Sign in with google" icon={IconSVGCode.google} onClick={()=>signInWithGoogle()} color={TailwindColor.blue}/>
        )
    },[])

    if(user){
        if(!username){
            return (
                <main className={`noside ${inter.className}`}>
                    <Navbar />
                    <UsernameForm />
                </main>
            )
        }else{
            return (
                <main className={`${inter.className}`}>
                    <Sidebar />
                </main>
            )
        }
    }else{
        return (
            <main className={`noside ${inter.className}`}>
                <Navbar />
                <div className="bg-white m-8 flex p-12">
                    {SignInButton}
                </div>
            </main>
        )
    }
}



export default SignIn