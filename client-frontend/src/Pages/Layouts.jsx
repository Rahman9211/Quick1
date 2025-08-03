import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react';
import Sidebar from '../Component/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';
const Layouts = () => {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser()

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>

      <nav className='w-full px-8 min-h-14 flex items-center
      justify-between border-b border-gray-200'>
        <img src={assets.logo} alt="logo" onClick={() => navigate('/')} className='cursor-pointer' />
        {
          sidebar
            ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
            : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>

      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} /> {/* ✅ Fixed line */}
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex item-center justify-center h-screen'>
      <SignIn />
    </div>
  )
};

export default Layouts;
