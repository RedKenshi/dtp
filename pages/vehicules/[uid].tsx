import Sidebar from "@/components/Sidebar"
import { Inter } from "next/font/google"
import { firestore } from "@/lib/firebase";
import { collection, doc, getDocs, getFirestore, orderBy, query, writeBatch } from "firebase/firestore";
import Link from "next/link";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Button from "@/components/utils/Button";
import IconSVG, { IconSVGCode } from "@/components/utils/IconSVG";

import { UserContext } from "@/contexts/User";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import { dtpChroma } from "@/lib/dtpChroma";
import FilesRelated from "@/components/utils/FilesRelated";

type Props = {
}
const inter = Inter({ subsets: ['latin'] })

const Vehicule = ({}:Props) => {

    const { user } = useContext(UserContext);
    const router = useRouter();
    const { uid } = router.query;
    const [vehicule, loading, error] = useDocument(
        doc(getFirestore(), 'vehicule', uid as string),
        {
          snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [formValues, setFormValues] = useState({
        newName : ""
    });

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
    }

    const createVehicule = async (e: React.MouseEvent<HTMLElement>) => {
        if(user){
            const vehiculeDoc = doc(getFirestore(), 'vehicule', `${formValues.newName.toLowerCase().replace(/\s+/g, '-')}-${uuidv4()}`);
            const batch = writeBatch(getFirestore());
            batch.set(vehiculeDoc, { name: formValues.newName });
            try{
                await batch.commit();
                toast.success(`Vehicule created`)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    };

    const deleteVehicule = async () => {
        if(user){
            const vehiculeDoc = doc(getFirestore(), 'vehicule', uid);
            const batch = writeBatch(getFirestore());
            batch.delete(vehiculeDoc);
            try{
                await batch.commit();
                toast.success(`${vehicule.name} deleted`)
            } catch {
                toast.error("Failed to create user name")
            }
        }
    };

    //router.push(`/vehicules`)


    return (
        <main className={`${inter.className}`}>
            <Sidebar />
            <div className="p-8 flex min-h-screen">
                <div className="flex flex-row gap-8 flex-1 ml-4 justify-start flex-grow">
                    <div className="flex-col-gap flex-1 ml-4 justify-start flex-grow">
                        <div className="flex-col-gap self-stretch justify-center items-center flex-grow">
                            <div className="flex-row-gap self-stretch justify-center items-center">
                                <IconSVG icon={IconSVGCode.user} size={"big"} iconPadding="unpadded" fill={dtpChroma.slate300}/>
                                <h1 className="ml-1 text-5xl font-bold text-slate-300 uppercase">{vehicule?.data().name}</h1>
                                <div className="flex-grow"></div>
                            </div>
                            <div className="flex flex-row gap-8 flex-grow self-stretch justify-center items-center">
                                <div className="flex-col-gap flex-grow self-stretch justify-center items-center bg-slate-200 rounded">
                                
                                </div>
                                <div className="flex-col-gap flex-grow self-stretch justify-center items-center bg-slate-200 rounded">
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <FilesRelated folderToStoreIn={`/uploads/vehicules/${uid}`} entityUID={uid as string}/>
                </div>
            </div>
        </main>
    )
}

export default Vehicule