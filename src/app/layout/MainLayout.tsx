import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
    <Header/>
    <main className='bg-white dark:bg-black dark:text-white'>
      <Outlet/>
    </main>
    <Footer/>
    </>
  );
};

export default memo(MainLayout);