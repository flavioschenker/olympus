import {ButtonHTMLAttributes} from 'react';

export default ({className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
        className={`
            p-2
            text-white
            cursor-pointer
            bg-blue-400
            rounded-md
            ${className || ''}
        `}
        {...props}
    ></button>
  );
};

