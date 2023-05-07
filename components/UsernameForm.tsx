import Button from "@/components/utils/Button"
import { UserContext } from "@/contexts/User"
import { firestore } from "@/lib/firebase"
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore"
import { debounce } from "lodash"
import { Inter } from "next/font/google"
import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { redirect,  } from 'next/navigation';
import { toast } from "react-hot-toast"
import { useRouter } from "next/router"

type Props = {
}

const inter = Inter({ subsets: ['latin'] })

const UsernameForm = ({}:Props) => {
    const [ value, setValue ] = useState<string>("")
    const [ isValid, setIsValid ] = useState<boolean>(false)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const { user, username, logout } = useContext(UserContext);
    const router = useRouter();
    
    const SignOutButton = useMemo(() => {
        return (
            <Button className="flex-grow" text="Sign out" onClick={logout} color={TailwindColor.gray}/>
        )
    },[logout])

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        if (val.length < 3) {
          setValue(val);
          setIsLoading(false);
          setIsValid(false);
        }
        if (re.test(val)) {
          setValue(val);
          setIsLoading(true);
          setIsValid(false);
        }
    };
    
    const checkUsername = useCallback(
        debounce(async (username:string) => {
            if (username.length >= 3) {
                const ref = doc(firestore, 'usernames', username);
                const snap = await getDoc(ref);
                console.log('Firestore read executed!', snap.exists());
                setIsValid(!snap.exists());
                setIsLoading(false);
            }
        }, 500
    ),[]);

    const onSubmit = async (e: React.MouseEvent<HTMLElement>) => {
        if(user){
            e.preventDefault
            const userDoc = doc(getFirestore(), 'users', user.uid);
            const usernameDoc = doc(getFirestore(), 'usernames', value);
            const batch = writeBatch(getFirestore());
            batch.set(userDoc, { username: value, photoURL: user.photoURL, displayName: user.displayName });
            batch.set(usernameDoc, { uid: user.uid });
            try{
                await batch.commit();
                toast.success(`Your name is now : ${value}`)
                router.push(`/${value}`)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    };
    
    useEffect(() => {
        checkUsername(value);
    }, [value]);

    return (
        <section className="flex-col flex-grow self-stretch flex-col-gap">
            <div className="panel flex flex-col items-center">
                <h3>Choose a name !</h3>
                <form className="flex-col-gap mt-2" autoComplete="none">
                    <input role="presentation" className="input" name="username" autoComplete="none" placeholder="username" value={value} type="text" onChange={handleChange}/>
                    {value.length >= 3 ?
                        isValid ?
                            <p className="text-xs font-bold text-green-400">Username disponible</p>
                        :
                            <p className="text-xs font-bold text-red-400">Username indisponible</p>
                    :
                        <></>
                    }
                    <div className="flex-row-gap">
                        {SignOutButton}
                        <Button loading={isLoading} text="Choose" disabled={!isValid} color={TailwindColor.green} onClick={e=>{e.preventDefault();onSubmit(e)}}/>
                    </div>
                </form>
                {/*
                <div className="panel mt-4">
                    <p>value : {value}</p>
                    <p>isValid : {isValid.toString()}</p>
                    <p>isLoading : {isLoading.toString()}</p>
                </div>
                */}
            </div>
        </section>
    )
}

export default UsernameForm