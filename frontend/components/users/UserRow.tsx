'use client'
import { PiTrashLight, PiPencilLight  } from "react-icons/pi";
import User from "@/lib/types/user";

export default (props:{ user: User }) => {
    return(
        <div className="w-full grid gap-2 grid-cols-[3fr_3fr_5fr_80px]">
            <div className="px-2 py-3">
                {props.user.first_name}
            </div>
            <div className="px-2 py-3">
                {props.user.last_name}
            </div>
            <div className="px-2 py-3">
                {props.user.email}
            </div>
            <div className="flex justify-center items-center py-2 px-2">
                <button className="p-1 cursor-pointer h-full hover:text-red-900"><PiPencilLight  className="h-full w-full"/></button>
                <button className="p-1 cursor-pointer h-full hover:text-red-900"><PiTrashLight className="h-full w-full"/></button>
            </div>
        </div>
    )
};