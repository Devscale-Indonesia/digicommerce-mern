import { Header } from '@/components/shared/header';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <main className="m-auto max-w-7xl space-y-24">
      <Header />
      <Outlet />
    </main>
  );
};
