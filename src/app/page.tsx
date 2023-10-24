import { NavbarHome } from '@/components/home/Navbar'
import DefaultFooter  from '@/components/global/Footer'
import Image from 'next/image'
import { getServerSession } from 'next-auth';
import options from './api/auth/[...nextauth]/options';

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <>
    {session ?  
    <div className='flex flex-col items-center justify-center py-2 bg-slate-50'>
    <h1 className='text-5xl font-bold text-black'>Welcome to Next.js!</h1>
    <pre className='text-xl font-bold text-black'>Session: {JSON.stringify(session.user)}</pre>
    </div> 
    : 
    <div className='flex flex-col items-center justify-center py-2 bg-slate-50'>
    <h1 className='text-5xl font-bold text-black'>Need to login</h1>
    </div> }
      
   
    </>
  );
}