'use client'
import React from 'react';
import { Button, Navbar, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { usePathname } from 'next/navigation'; // To get the pathname of website

export default function Header() {
  const path = usePathname(); // Get the pathname of website
  return (
    <>
    <Navbar className='border-b-2'>
      <Link href='/'
      className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-pink-500 rounded-lg text-white'>Crónicas </span>del Vejerete
      </Link>
      <form>
        <TextInput
          type='text'
          placeholder='Buscar...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 hidden sm:inline' color='gray' pill><FaMoon/></Button>
      <div className='flex gap-2 md:order-2'>
      <Link href='/signin'>
        <Button gradientDuoTone='purpleToBlue' outline>Iniciar sesión</Button>
        </Link>
        <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
        <Link href='/'>
          <Navbar.Link active={path === '/'} as={'div'}>
            Home
          </Navbar.Link>
        </Link>
        <Link href='/about'>
          <Navbar.Link active={path === '/about'} as={'div'}>
            Acerca
          </Navbar.Link>
        </Link>
        <Link href='/projects'>
          <Navbar.Link active={path === '/projects'} as={'div'}>
            Projectos
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
      </Navbar>      
    </>
  );
}
