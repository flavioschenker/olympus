import Profile from '@/assets/images/profile.jpg';
import Image from "next/image";


export default () => {
    return (
        <div className='h-full flex flex-row gap-3 items-center'>
            <div className='h-[70%] relative rounded-2xl overflow-hidden aspect-square'>
                <Image src={Profile} fill alt="Profile"/>
            </div>
            <div className='flex flex-col gap-1'>
                <span className='text-text-primary font-bold'>Flavio Schenker</span>
                <span className='text-text-secondary text-xs'>flavio.schenker@outlook.com</span>
            </div>
        </div>
    );
};