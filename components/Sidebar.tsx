import Link from "next/link";
import IconSVG, { IconSVGCode } from "./utils/IconSVG";
import { UserContext } from "@/contexts/User";
import { useContext } from "react";

type Props = {}

type MenuItem = {
    icon:IconSVGCode,
    label:string,
    url:string,
    display:boolean
}

const Sidebar = ({}:Props) => {

    const { user, username, logout } = useContext(UserContext);

    const menuItems = [
        {
            icon:IconSVGCode.home,
            label:"Accueil",
            url:"/",
            display:true
        },{
            icon:IconSVGCode.user,
            label:"Equipiers",
            url:"/equipiers",
            display:true
        },{
            icon:IconSVGCode.team,
            label:"Equipes",
            url:"/equipes",
            display:true
        },{
            icon:IconSVGCode.truck,
            label:"Vehicules",
            url:"/vehicules",
            display:true
        }
    ] as MenuItem[];

    const adminItems = [
        {
            icon:IconSVGCode.shield,
            label:"Admin",
            url:"/admin/users",
            display:true
        }
    ] as MenuItem[];

    return (
        <>
            <aside id="separator-sidebar" className="shadow-xl shadow-slate-700 fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col">
                    <ul className="p-4 space-y-2 font-medium">
                        <li>
                            <h1 className="mr-3 text-lg text-indigo-500 text-center ml-2">DIEUZAIDE TP</h1>
                        </li>
                    </ul>
                    <ul className="pt-4 mt-1 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        {menuItems.map((menuItem:MenuItem,index:number)=>{
                            return (
                                <li className={"group"} key={`${index}-${menuItem.url}`}>
                                    <Link href={menuItem.url} className="flex items-center text-gray-900 rounded-lg dark:text-white group-hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <IconSVG className="w-8" icon={menuItem.icon} size={"medium"} fill={"#95afc0"}/>
                                        <span className="ml-2 text-sm group-hover:text-indigo-500">{menuItem.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <ul className="pt-4 mt-1 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        {adminItems.map((menuItem:MenuItem,index:number)=>{
                            return (
                                <li className={"group"} key={`${index}-${menuItem.url}`}>
                                    <Link href={menuItem.url} className="flex items-center text-gray-900 rounded-lg dark:text-white group-hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <IconSVG className="w-8" icon={menuItem.icon} size={"medium"} fill={"#95afc0"}/>
                                        <span className="ml-2 text-sm group-hover:text-indigo-500">{menuItem.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    <ul className="space-y-2 font-medium flex-grow flex flex-col justify-end">
                        <li>
                            <Link href={`/${username}`} className="flex flex-col justify-center items-center gap-2">
                                <img src={user?.photoURL} className="w-16 h-16 rounded-full"/>
                                <h4>{user?.displayName}</h4>
                            </Link>
                        </li>
                    </ul>
                    <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        <li>
                            <button onClick={logout} className="w-full flex items-center text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                <IconSVG icon={IconSVGCode.poweroff} fill={"#e74c3c"} size={"medium"}/>
                                <span className="ml-2">Log Out</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;