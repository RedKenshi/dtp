
import { Inter } from "next/font/google"
import Button from "@/components/utils/Button";
import IconSVG, { IconSVGCode } from "@/components/utils/IconSVG";
import { TailwindColor } from "@/types/types";

type DrawerAction = {
    text:string,
    icon:IconSVGCode,
    color :TailwindColor,
    onClick: (e: React.MouseEvent<HTMLElement>) => void
}

type Props = {
    isOpen:boolean,
    confirm:DrawerAction,
    cancel:DrawerAction,
    text:string,
    info:string,
}
const inter = Inter({ subsets: ['latin'] })

const ConfirmDrawer = ({isOpen,cancel,confirm,text,info}:Props) => {

    return (
        <div className={`absolute bottom-0 m-auto pb-16 left-1/2 -translate-x-1/2 rounded-full z-40 transition-transform ${(isOpen ? "tranform-none" : "translate-y-full")} flex-row-gap justify-between`}>
            <div className={`shadow-xl shadow-slate-600 rounded-full p-4 mx-auto overflow-y-auto bg-white dark:bg-gray-800 flex-row-gap justify-between items-center`}>
                <button
                    className={`h-16 w-16 rounded-full justify-center cursor-pointer pointer-events-auto bg-${cancel.color}-400 px-3 py-2 hover:bg-${cancel.color}-300 flex items-center`}
                    onClick={cancel.onClick}
                >
                    <IconSVG fill="#fff" icon={cancel.icon} size={"medium"} iconPadding="unpadded"/>
                </button>
                <div className="flex flex-col gap-1 items-center">
                    <p className="text-center font text-xl mx-8 text-gray-400">{text}</p>
                    <p className="text-center font text-xl mx-8 text-gray-800">{info}</p>
                </div>
                <button
                    className={`h-16 w-16 rounded-full justify-center cursor-pointer pointer-events-auto bg-${confirm.color}-400 px-3 py-2 hover:bg-${confirm.color}-300 flex items-center`}
                    onClick={confirm.onClick}
                >
                    <IconSVG fill="#fff" icon={confirm.icon} size={"medium"} iconPadding="unpadded"/>
                </button>
            </div>
        </div>
    )
}
export default ConfirmDrawer