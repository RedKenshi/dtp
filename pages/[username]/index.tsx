import Sidebar from "@/components/Sidebar"
import { Inter } from "next/font/google"

type Props = {
}
const inter = Inter({ subsets: ['latin'] })

const UserIndex = ({}:Props) => {
    return (
        <main className={`${inter.className}`}>
            <Sidebar />
            <div className="bg-white m-8 flex">
                <h1>HEY</h1>
            </div>
        </main>
    )
}

export default UserIndex