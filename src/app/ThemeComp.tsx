'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import React from 'react'

export default function ThemeComp({children}) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);{
        if(!mounted) {
            return null;
        }
    }
  return (
    <div className='theme'>
        <div className='bg-white text-gray-700'></div>
        {children}
    </div>
  )
}
