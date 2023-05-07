import { IconSVGCode } from "@/components/utils/IconSVG"

export type Equipier = {
    uid:string,
    name:string,
    team:string|null
}

export type Equipe = {
    uid:string,
    name:string
}

export enum TailwindColor {
    slate = "slate",
    gray = "gray",
    zinc = "zinc",
    neutral = "neutral",
    stone = "stone",
    red = "red",
    orange = "orange",
    amber = "amber",
    yellow = "yellow",
    lime = "lime",
    green = "green",
    emerald = "emerald",
    teal = "teal",
    cyan = "cyan",
    sky = "sky",
    blue = "blue",
    indigo = "indigo",
    violet = "violet",
    purple = "purple",
    fuchsia = "fuchsia",
    pink = "pink",
    rose = "rose"
}

export type DrawerAction = {
    key:string,
    text:string,
    icon:IconSVGCode
    color : TailwindColor,
    onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export type StoredFile = {
    uid:string
    type:string,
    filename:string,
    file:null,
}

export type Vehicule = {
    uid:string
    registration:string,
    name:string
}