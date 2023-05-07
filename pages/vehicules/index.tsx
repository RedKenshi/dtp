import Sidebar from "@/components/Sidebar"
import { Inter } from "next/font/google"
import { firestore } from "@/lib/firebase";
import { collection, doc, getDocs, getFirestore, orderBy, query, writeBatch } from "firebase/firestore";
import Link from "next/link";
import { ChangeEvent, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import Button from "@/components/utils/Button";
import IconSVG, { IconSVGCode } from "@/components/utils/IconSVG";

import { UserContext } from "@/contexts/User";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import DrawerWithActions from "@/components/utils/DrawerWithActions";
import ConfirmDrawer from "@/components/utils/ConfirmDrawer";
import OutlineButton from "@/components/utils/OutlineButton";
import { TailwindColor, Vehicule } from "@/types/types";
import RegistrationInput from "@/components/utils/RegistrationInput";

type Props = {
}

const inter = Inter({ subsets: ['latin'] })

const Vehicules = ({}:Props) => {

    const { user } = useContext(UserContext);
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        newName : "",
        newRegistration : "",
    });

    const [registrationIsValid, setRegistrationIsValid] = useState<boolean>(false)

    const [ addVehiculeDrawerOpen, setAddVehiculeDrawerOpen ] = useState<boolean>(false)
    const [ confirmDeleteDrawerOpen, setConfirmDeleteDrawerOpen ] = useState<boolean>(false)
    const [ targetVehicule, setTargetVehicule ] = useState<Vehicule|null>(null)

    const handleChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    },[formValues])

    const setRegistrationValue = useCallback((newRegistration:string) => {
        setFormValues({
            ...formValues,
            newRegistration : newRegistration
        })
    },[formValues])

    const ref = collection(getFirestore(), 'vehicule')
    const q = query(ref)
    const [querySnapshot] = useCollection(q);
    const vehicules = querySnapshot?.docs.map((doc) => {
        return Object.assign({...doc.data()},{uid:doc.id})
    }) as Vehicule[];

    const createVehicule = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        if(user && registrationIsValid){
            const vehiculeDoc = doc(getFirestore(), 'vehicule', `${formValues.newName.toLowerCase().replace(/\s+/g, '-')}-${uuidv4()}`);
            const batch = writeBatch(getFirestore());
            batch.set(vehiculeDoc, { name: formValues.newName, registration:formValues.newRegistration });
            try{
                await batch.commit();
                toast.success(`Vehicule created`)
                setAddVehiculeDrawerOpen(false)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    },[user,formValues,registrationIsValid]);

    const deleteVehicule = useCallback(async (vehicule: Vehicule) => {
        if(user){
            const vehiculeDoc = doc(getFirestore(), 'vehicule', vehicule.uid);
            const batch = writeBatch(getFirestore());
            batch.delete(vehiculeDoc);
            try{
                await batch.commit();
                toast.success(`${vehicule.name} deleted`)
                setConfirmDeleteDrawerOpen(false)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    },[user]);

    const viewVehicule = (uid: string) => {
        router.push(`/vehicules/${uid}`)
    };

    const addVehiculeDrawer = useMemo(()=>{
        return (
            <DrawerWithActions
                isOpen={addVehiculeDrawerOpen}
                actions={[{
                    key:"cancelCreateVehicule",
                    color:TailwindColor.gray,
                    icon:IconSVGCode.xmark,
                    onClick:()=>{setAddVehiculeDrawerOpen(false)},
                    text:"Annuler"
                },{
                    key:"createVehicule",
                    color:TailwindColor.green,
                    icon:IconSVGCode.check,
                    onClick:(e)=>{createVehicule(e)},
                    text:"Créer le vehicule"
                }]}
            >
                <>
                    <div className="bg-slate-50 w-full p-4 flex flex-row items-center">
                        <h2 className="ml-1 text-4xl flex-grow font-bold text-slate-300 uppercase">Créer un vehicule</h2>
                        <IconSVG icon={IconSVGCode.burgerfries}/>
                    </div>
                    <div className="flex flex-col gap-4 m-4 self-stretch flex-grow">
                        <div className="flex flex-col">
                            <label htmlFor="newName" className="text-sm font-medium text-gray-900 dark:text-white">Nom du vehicule</label>
                            <input onChange={handleChange} id="newName" name="newName" className="input mt-0"/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="newName" className="text-sm font-medium text-gray-900 dark:text-white">Nom du vehicule</label>
                            <RegistrationInput setRegistrationValue={(value:string)=>setRegistrationValue(value)} setValid={(valid:boolean)=>setRegistrationIsValid(valid)}/>
                        </div>
                    </div>
                </>
            </DrawerWithActions>
        )
    },[addVehiculeDrawerOpen,createVehicule,handleChange,setRegistrationValue])

    const initDeleteVehicule = (vehicule : Vehicule) => {
        setTargetVehicule(vehicule)
        setConfirmDeleteDrawerOpen(true)
    }

    const cancelDeleteVehicule = () => {
        setTargetVehicule(null)
        setConfirmDeleteDrawerOpen(false)
    }

    const confirmDeleteVehiculeDrawer = useMemo(()=>{
        return (
            <ConfirmDrawer
                isOpen={confirmDeleteDrawerOpen}
                cancel={{
                    color:TailwindColor.gray,
                    icon:IconSVGCode.xmark,
                    onClick:cancelDeleteVehicule,
                    text:"Cancel"
                }}
                confirm={{
                    color:TailwindColor.red,
                    icon:IconSVGCode.trash,
                    onClick:(e)=>{targetVehicule?deleteVehicule(targetVehicule):null},
                    text:"Delete"
                }}
                text={`Supprimer ce vehicule ?`}
                info={targetVehicule?targetVehicule.name:""}
            />
        )
    },[confirmDeleteDrawerOpen,deleteVehicule,targetVehicule])

    return (
        <>
            <main className={`${inter.className}`}>
                <Sidebar />
                <div className="bg-white m-8 flex">
                    <div className="flex-col-gap flex-1 ml-4">
                        <div className="flex-row-gap flex-grow self-stretch justify-center items-center">
                            <h1 className="ml-1 text-5xl font-bold text-slate-300 uppercase">Vehicules</h1>
                            <input className="ml-4 input flex-grow" placeholder="Rechercher un vehicule ..."/>
                            <Button onClick={()=>setAddVehiculeDrawerOpen(true)} className="min-w-fit" text="Créer un vehicule" icon={IconSVGCode.plus} />
                        </div>
                        <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-indigo-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 flex-grow">Name</th>
                                    <th scope="col" className="px-6 py-3 flex-grow">Registration</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicules?.map((vehicule:Vehicule)=>{
                                    return (
                                        <tr key={vehicule.uid} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{vehicule.name}</th>
                                            <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{vehicule.registration}</th>
                                            <td className="text-left flex flex-row justify-end h-full">
                                                <OutlineButton icon={IconSVGCode.trash} color={TailwindColor.red} onClick={()=>{initDeleteVehicule(vehicule)}}/>
                                                <OutlineButton icon={IconSVGCode.search} color={TailwindColor.indigo} onClick={()=>{viewVehicule(vehicule.uid)}}/>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <nav>
                            <ul className="inline-flex items-center -space-x-px">
                                <li>
                                <a href="#" className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <span className="sr-only">Previous</span>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                </a>
                                </li>
                                <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                                </li>
                                <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                                </li>
                                <li>
                                <a href="#" aria-current="page" className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                                </li>
                                <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                                </li>
                                <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                                </li>
                                <li>
                                <a href="#" className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <span className="sr-only">Next</span>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                {addVehiculeDrawer}
                {confirmDeleteVehiculeDrawer}
            </main>
        </>
    )
}

export default Vehicules