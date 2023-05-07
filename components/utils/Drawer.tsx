
import { Inter } from "next/font/google"
import Button from "@/components/utils/Button";
import IconSVG, { IconSVGCode } from "@/components/utils/IconSVG";
import { DrawerAction } from "@/types/types";

type Props = {
    isOpen:boolean
    actions:DrawerAction[]
    children:JSX.Element
}
const inter = Inter({ subsets: ['latin'] })

const DrawerWithActions = ({isOpen,actions,children}:Props) => {

    return (
        <div className={`shadow-2xl shadow-slate-950 absolute top-0 right-0 z-40 h-screen overflow-y-auto transition-transform ${(isOpen ? "translate-x-0" : "translate-x-full")} bg-white w-1/3 dark:bg-gray-800 flex-col-gap`}>
            {children}
            <div className="grid grid-cols-2 gap-4 m-4">
                {actions.map((action:DrawerAction)=>{
                    return (
                        <Button key={action.key} color={action.color} text={action.text} icon={action.icon} onClick={action.onClick}/>
                    )
                })}
            </div>
        </div>
    )
}
export default DrawerWithActions