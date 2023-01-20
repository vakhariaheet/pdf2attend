import React from 'react';
import './PDFLoading.scss'; 

export interface PDFLoadingProps {
    height: number;
}

const PDFLoading: React.FC<PDFLoadingProps> = ({height}) => {
 return <div className={`flex justify-center items-center h-[${height}px] aspect-[4/6] w-auto`}>
 <svg
     className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
     xmlns='http://www.w3.org/2000/svg'
     fill='none'
     viewBox='0 0 24 24'
 >
     <circle
         className='opacity-25'
         cx='12'
         cy='12'
         r='10'
         stroke='currentColor'
         strokeWidth='4'
     ></circle>
     <path
         className='opacity-75'
         fill='currentColor'
         d='M4 12a8 8 0 018-8v8z'
     ></path>
 </svg>
 <p>Loading PDF...</p>
</div>;
};

export default PDFLoading;