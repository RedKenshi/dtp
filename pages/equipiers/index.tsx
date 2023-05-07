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
import { Equipier, TailwindColor } from "@/types/types";

type Props = {
}

const inter = Inter({ subsets: ['latin'] })

const Equipiers = ({}:Props) => {

    const { user } = useContext(UserContext);
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        newName : ""
    });

    const [ addEquipierDrawerOpen, setAddEquipierDrawerOpen ] = useState<boolean>(false)
    const [ confirmDeleteDrawerOpen, setConfirmDeleteDrawerOpen ] = useState<boolean>(false)
    const [ targetEquipier, setTargetEquipier ] = useState<Equipier|null>(null)

    const handleChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    },[formValues])

    const ref = collection(getFirestore(), 'equipier')
    const q = query(ref)
    const [querySnapshot] = useCollection(q);
    const equipiers = querySnapshot?.docs.map((doc) => {
        return Object.assign({...doc.data()},{uid:doc.id})
    }) as Equipier[];

    const createEquipier = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        if(user){
            const equipierDoc = doc(getFirestore(), 'equipier', `${formValues.newName.toLowerCase().replace(/\s+/g, '-')}-${uuidv4()}`);
            const batch = writeBatch(getFirestore());
            batch.set(equipierDoc, { name: formValues.newName, team : null } as Equipier);
            try{
                await batch.commit();
                toast.success(`Equipier created`)
                setAddEquipierDrawerOpen(false)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    },[user,formValues]);

    const deleteEquipier = useCallback(async (equipier: Equipier) => {
        if(user){
            const equipierDoc = doc(getFirestore(), 'equipier', equipier.uid);
            const batch = writeBatch(getFirestore());
            batch.delete(equipierDoc);
            try{
                await batch.commit();
                toast.success(`${equipier.name} deleted`)
                setConfirmDeleteDrawerOpen(false)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    },[user]);

    const viewEquipier = (uid: string) => {
        router.push(`/equipiers/${uid}`)
    };

    const addEquipierDrawer = useMemo(()=>{
        return (
            <DrawerWithActions
                isOpen={addEquipierDrawerOpen}
                actions={[{
                    key:"cancelCreateEquipier",
                    color:TailwindColor.gray,
                    icon:IconSVGCode.xmark,
                    onClick:()=>{setAddEquipierDrawerOpen(false)},
                    text:"Annuler"
                },{
                    key:"createEquipier",
                    color:TailwindColor.green,
                    icon:IconSVGCode.check,
                    onClick:(e)=>{createEquipier(e)},
                    text:"Créer l'equipier"
                }]}
            >
                <>
                    <div className="bg-slate-50 w-full p-4 flex flex-row items-center">
                        <h2 className="ml-1 text-4xl flex-grow font-bold text-slate-300 uppercase">Créer un equipier</h2>
                        <IconSVG icon={IconSVGCode.user}/>
                    </div>
                    <div className="flex flex-col gap-4 m-4 self-stretch flex-grow">
                        <div className="flex flex-col">
                            <label htmlFor="newName" className="text-sm font-medium text-gray-900 dark:text-white">{`Nom de l'equipier`}</label>
                            <input onChange={handleChange} id="newName" name="newName" className="input mt-0"/>
                        </div>
                    </div>
                </>
            </DrawerWithActions>
        )
    },[addEquipierDrawerOpen,createEquipier,handleChange])

    const initDeleteEquipier = (equipier : Equipier) => {
        setTargetEquipier(equipier)
        setConfirmDeleteDrawerOpen(true)
    }

    const cancelDeleteEquipier = () => {
        setTargetEquipier(null)
        setConfirmDeleteDrawerOpen(false)
    }

    const confirmDeleteEquipierDrawer = useMemo(()=>{
        return (
            <ConfirmDrawer
                isOpen={confirmDeleteDrawerOpen}
                cancel={{
                    color:TailwindColor.gray,
                    icon:IconSVGCode.xmark,
                    onClick:cancelDeleteEquipier,
                    text:"Cancel"
                }}
                confirm={{
                    color:TailwindColor.red,
                    icon:IconSVGCode.trash,
                    onClick:(e)=>{targetEquipier?deleteEquipier(targetEquipier):null},
                    text:"Delete"
                }}
                text={`Supprimer ce equipier ?`}
                info={targetEquipier?targetEquipier.name:""}
            />
        )
    },[confirmDeleteDrawerOpen,deleteEquipier,targetEquipier])

    return (
        <>
            <main className={`${inter.className}`}>
                <Sidebar />
                <div className="bg-white m-8 flex">
                    <div className="flex-col-gap flex-1 ml-4">
                        <div className="flex-row-gap flex-grow self-stretch justify-center items-center">
                            <h1 className="ml-1 text-5xl font-bold text-slate-300 uppercase">Equipiers</h1>
                            <input className="ml-4 input flex-grow" placeholder="Rechercher un equipier ..."/>
                            <Button onClick={()=>setAddEquipierDrawerOpen(true)} className="min-w-fit" text="Créer un equipier" icon={IconSVGCode.plus} />
                        </div>
                        <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-indigo-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 flex-grow">Name</th>
                                    <th scope="col" className="px-6 py-3 flex-grow">Equipe</th>
                                    <th scope="col" className="px-6 py-3 flex-grow-0">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipiers?.map((equipier:Equipier)=>{
                                    return (
                                        <tr key={equipier.uid} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{equipier.name}</th>
                                            <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{equipier.team??"Aucune"}</th>
                                            <td className="text-left flex flex-row justify-end h-full">
                                                <OutlineButton icon={IconSVGCode.trash} color={TailwindColor.red} onClick={()=>{initDeleteEquipier(equipier)}}/>
                                                <OutlineButton icon={IconSVGCode.search} color={TailwindColor.indigo} onClick={()=>{viewEquipier(equipier.uid)}}/>
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
                {addEquipierDrawer}
                {confirmDeleteEquipierDrawer}
            </main>
        </>
    )
}

export default Equipiers