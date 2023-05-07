
import { Inter } from "next/font/google"
import Button from "@/components/utils/Button";
import { StoredFile } from "@/types/types";
import IconSVG, { IconSVGCode } from "./IconSVG";
import { useCallback, useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable, listAll, ListResult, StorageReference } from "firebase/storage";
import { dtpChroma } from "@/lib/dtpChroma";

type Props = {
    folderToStoreIn:string;
    entityUID:string;
}
const inter = Inter({ subsets: ['latin'] })

const FilesRelated = ({folderToStoreIn,entityUID}:Props) => {

    const [files,setFiles] = useState([])
    const [selectedFile,setSelectedFile] = useState<string|null>(null)
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const loadFilesInFolder = useCallback( async () => {
        const res = await listAll(ref(storage, `${folderToStoreIn}`)) as ListResult
        const tmpFiles =  await Promise.all(
            res.items.map(async (itemRef:StorageReference) => {
                const tmpUrl = await getDownloadURL(itemRef)
                const tmp = {
                    name:itemRef._location.path_.split("/")[itemRef._location.path_.split("/").length-1],
                    path:itemRef._location.path_,
                    url:tmpUrl,
                    ref:itemRef
                }
                return(tmp)
            })
        )
        setFiles(tmpFiles)
    },[folderToStoreIn])

    useEffect(()=>{
        loadFilesInFolder()
    },[loadFilesInFolder])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }else{
            setFile(null);
            setFileName("");
        }
    };

    const uploadFile = async (e: React.MouseEvent<HTMLInputElement>) => {
        if(!file)return
        const fileRef = ref(storage, `${folderToStoreIn}/${fileName}`);
        const task = uploadBytesResumable(fileRef, file)
        task.then((url) => {
            loadFilesInFolder()
        });
    };

    return (
        <div className="pointer-events-auto relative z-10 rounded-lg bg-white leading-5 text-slate-700 shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
            <div>
                <div className="flex items-center py-2 h-16">
                    <h3 className="flex-grow text-center text-2xl text-slate-400 font-bold uppercase">Fichiers liés</h3>
                </div>
                <div className="border-t flex flex-col p-3 border-slate-400/20 py-3">
                    <div className="flex flex-col mb-1 items-start rounded-md">
                        <label htmlFor="newFile" className="text-xs font-semibold text-gray-400 dark:text-white">{`Fichier`}</label>
                        <input name="newFile" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />
                    </div>
                    <Button className="mt-2 flex-grow" text="Upload" icon={IconSVGCode.upload} onClick={(e)=>uploadFile(e)}/>
                </div>
                <div className="border-t border-slate-400/20">
                    {files.map((file:StoredFile,index:number)=>{
                        if(file.path != selectedFile || file.path == undefined || selectedFile == null){
                            return (
                                <div key={`${file.path}-${index}`} className="flex flex-row gap-1 px-2 py-4 cursor-pointer border border-slate-200 flex items-center" onClick={()=>setSelectedFile(file.path)}>
                                    <IconSVG icon={IconSVGCode.file} size={"small"} iconPadding="unpadded" fill={dtpChroma.slate500}/>
                                    <p className="">{file.name}</p>
                                </div>
                            )
                        }else{
                            return (
                                <div key={`${file.path}-${index}`} className="flex flex-row justify-between px-2 py-1 cursor-pointer border-2 border-indigo-500 items-center" onClick={()=>setSelectedFile(file.path)}>
                                    <div className="flex flex-row gap-1">
                                        <IconSVG icon={IconSVGCode.file} size={"small"} iconPadding="unpadded" fill={dtpChroma.slate500}/>
                                        <p className="">{file.name}</p>
                                    </div>
                                    <a onClick={()=>{window.open(file.url,'_blank');}} className={`justify-center cursor-pointer m-1 rounded-md pointer-events-auto border-2 border-indigo-400 bg-indigo-200 px-3 py-2 hover:bg-indigo-100 flex items-center`}>
                                        <IconSVG icon={IconSVGCode.download} size={"medium"} iconPadding="unpadded" fill={dtpChroma.indigo400}/>
                                    </a>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
export default FilesRelated