import Sidebar from "@/components/Sidebar"
import { firestore } from "@/lib/firebase";
import { User } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

type Props = {
}

const inter = Inter({ subsets: ['latin'] })

const AdminUsers = ({}:Props) => {

    //const [ users, setUsers ] = useState<User[]>([])

    const ref = collection(getFirestore(), 'users')
    const q = query(ref)
    const [querySnapshot] = useCollection(q);
    const users = querySnapshot?.docs.map((doc) => {
        return Object.assign({...doc.data()},{uid:doc.id})
    });

    return (
        <main className={`${inter.className}`}>
            <Sidebar />
            <div className="my-8 ml-10 mr-16 flex-row-gap">
            <ul role="menu" className="min-w-fit self-start rounded-md border border-blue-gray-50 bg-white py-4 font-sans text-sm font-normal shadow-lg shadow-blue-gray-500/10">
                <Link href={"#"} className="block w-full cursor-pointer px-4 py-2 mb-2 text-start transition-all hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-indigo-600 hover:text-white last:mb-0">
                    Menu Item 1
                </Link>
                <Link href={"#"} className="block w-full cursor-pointer px-4 py-2 mb-2 text-start transition-all hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 hover:bg-indigo-600 hover:text-white last:mb-0">
                    Menu Item 2
                </Link>
            </ul>
            <div className="flex-col-gap flex-1 ml-4">
                    <input className="input"/>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Avatar</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Mail</th>
                                <th scope="col" className="px-6 py-3">Joined on</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user=>{
                                return (
                                    <tr key={user.uid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.username}</th>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4"><a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>


                    <nav aria-label="Page navigation example">
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
        </main>
    )
}

export default AdminUsers