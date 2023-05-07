import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar';
import { useContext } from 'react';
import { UserContext } from '@/contexts/User';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/utils/Button';
import SignInWithGoogleButton from '@/components/utils/SignInWithGoogleButton';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { user, username } = useContext(UserContext);

  if(user){
    return (
      <main className={`${inter.className}`}>
          <Sidebar />
      </main>
    )
  }else{
    return (
      <main className={`noside ${inter.className} flex flex-col`}>
          <Navbar />
          <div className='flex pt-32 flex-col flex-grow items-center self-stretch'>
            <h2 className='text-3xl'>Bienvenue vous !</h2>
            <img className='m-8 h-64 w-64' alt='planet' src={"/pelle.svg"}/>
            <SignInWithGoogleButton />
          </div>
      </main>
    )
  }
}
