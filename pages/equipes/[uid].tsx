import Sidebar from "@/components/Sidebar"
import { Inter } from "next/font/google"
import { firestore } from "@/lib/firebase";
import { collection, doc, getDocs, getFirestore, limit, orderBy, query, where, writeBatch } from "firebase/firestore";
import Link from "next/link";
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Button from "@/components/utils/Button";
import IconSVG, { IconSVGCode } from "@/components/utils/IconSVG";

import { UserContext } from "@/contexts/User";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import { dtpChroma } from "@/lib/dtpChroma";
import { Equipier, StoredFile } from "@/types/types";
import FilesRelated from "@/components/utils/FilesRelated";

type Props = {
}
const inter = Inter({ subsets: ['latin'] })

const Equipe = ({}:Props) => {

    const { user } = useContext(UserContext);
    const router = useRouter();
    const [ equipiersTeam, setEquipiersTeam ] = useState<Equipier[]>([])
    const [ equipiersAvailable, setEquipiersAvailable ] = useState<Equipier[]>([])
    const { uid } = router.query;
    const [equipe, loading, error] = useDocument(
        doc(getFirestore(), 'equipe', uid as string),
        {
          snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [ files, setFiles ] = useState<StoredFile[]>([

    ])

    const loadTeams = useCallback(async () => {
        const ref = collection(getFirestore(), 'equipier')
        const qTeam = query(
            ref, 
            where('team', '==', uid),
        )
        const qAvailable = query(
            ref, 
            where('team', '==', null),
        )
        setEquipiersTeam((await getDocs(qTeam)).docs.map((doc) => doc.data() as Equipier))
        console.log({equipiersTeam})
        setEquipiersAvailable((await getDocs(qAvailable)).docs.map((doc) => doc.data() as Equipier))
        console.log({equipiersAvailable})
    },[])

    useEffect(()=>{
        loadTeams()
    },[loadTeams])


    const [formValues, setFormValues] = useState({
        newName : ""
    });

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }

    const deleteEquipe = async () => {
        if(user){
            const equipeDoc = doc(getFirestore(), 'equipe', uid);
            const batch = writeBatch(getFirestore());
            batch.delete(equipeDoc);
            try{
                await batch.commit();
                toast.success(`${equipe.name} deleted`)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    };

    return (
        <main className={`${inter.className}`}>
            <Sidebar />
            <div className="p-8 gap-8 flex min-h-screen">
                <div className="flex-row-gap flex-1 ml-4 justify-start flex-grow">
                    <div className="flex-col-gap flex-1 ml-4 justify-start flex-grow">
                        <div className="flex-col-gap self-stretch justify-center items-center flex-grow">
                            <div className="flex-row-gap self-stretch justify-center items-center">
                                <IconSVG icon={IconSVGCode.team} size={"big"} iconPadding="unpadded" fill={dtpChroma.slate300}/>
                                <h1 className="ml-1 text-5xl font-bold text-slate-300 uppercase">{equipe?.data().name}</h1>
                                <div className="flex-grow"></div>
                            </div>
                            <div className="flex flex-row gap-8 flex-grow self-stretch justify-center items-center">
                                <div className="flex-col-gap flex-grow self-stretch bg-slate-200 rounded">
                                    {equipiersTeam.map((equipier:Equipier)=>{
                                        return (
                                            <div key={equipier.uid} className="flex flex-row items-center m-2 p-2 h-8 bg-sky-200 rounded">
                                                <p>{equipier.name}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex-col-gap flex-grow self-stretch bg-slate-200 rounded">
                                    {equipiersAvailable.map((equipier:Equipier)=>{
                                        return (
                                            <div key={equipier.uid} className="flex flex-row items-center m-2 p-2 h-8 bg-sky-200 rounded">
                                                <p>{equipier.name}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Equipe