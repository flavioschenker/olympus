"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidFoodMenu } from "react-icons/bi";
import { PiHouseFill, PiBowlFoodFill } from "react-icons/pi";
import { FaAppleAlt, FaRunning  } from "react-icons/fa";

const menuData = [
    {
        title: 'Home',
        link: '/',
        logo: <PiHouseFill/>,
    },
    {
        title: 'Ingredients',
        link: '/ingredients',
        logo: <FaAppleAlt/>,
    },
    {
        title: 'Recipes',
        link: '/recipes',
        logo: <BiSolidFoodMenu/>,
    },
    {
        title: 'Calories',
        link: '/calories',
        logo: <FaRunning/>,
    }
];


export default () => {
    const currentPath = usePathname();

    return (
        <div className='flex flex-col items-start'>
            {menuData.map((i) => {
                const isActive = i.link === currentPath;
                return (
                    <MenuItem key={i.title} active={isActive} title={i.title} link={i.link} logo={i.logo} />
                );
            })}
        </div>
    );
};


export const MenuItem = (props: { active: boolean; title: string; link: string; logo: React.ReactNode }) => {
    return (
        <Link href={props.link} className={`
            w-full
            py-2.5
            px-3
            text-lg
            rounded-xl
            border-border
            flex
            flex-row
            gap-3
            justify-start
            items-center
            hover:text-blue-900
            cursor-pointer
            ${props.active ? 'bg-white border text-text-primary shadow-sm' : 'text-text-secondary'}
        `}>
            {props.logo}
            <span>{props.title}</span>
        </Link>
    );
}
