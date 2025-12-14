import {InputHTMLAttributes} from 'react';

export default ({className, ...props}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
        className={`
            px-2
            py-3
            text-sm
            border
            border-gray-200
            rounded-md
            focus:outline-none
            focus:border-blue-400
            ${className || ''}
        `}
        {...props}
    />
  );
};


