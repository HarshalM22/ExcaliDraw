import { ReactNode } from "react"

export function IconButton({icon,onClick,activated}:{
    icon: ReactNode,
    onClick : ()=> void,
    activated: boolean
}) {
  return (
    <div className={`cursor-pointer rounded-md border-2 p-2 ${activated?`bg-blue-200 text-black`:`text-black` } ` }onClick={onClick}> 
      {icon}
    </div>
  )
}
