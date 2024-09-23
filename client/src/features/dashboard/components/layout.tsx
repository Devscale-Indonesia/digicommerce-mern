import { Box, Home, Receipt, Users } from 'lucide-react';
import { Menu } from './layout.menu';
import { Button } from '../../../components/ui/button';
import { memo, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  isCentered?: boolean;
}

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
}

const LayoutDashboard = (props: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const userCookie = JSON.parse(Cookies.get('user') as string);

    if (token) {
      setIsAuthenticated(true);
      setUser(userCookie);
    } else {
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen">
      <aside className="flex w-[240px] flex-col justify-between bg-gradient-to-b from-primary-50/50 to-rose-50/60 p-6">
        <section>
          <div className="mb-4 px-3 py-2 text-sm font-bold">Digicommerce.</div>
          <Menu label="Dashboard" href="/dashboard" icon={<Home size={18} />} />
          <Menu label="Products" href="/dashboard/products" icon={<Box size={18} />} />
          <Menu label="Orders" icon={<Receipt size={18} />} />
          <Menu label="Customers" icon={<Users size={18} />} />
        </section>
        <div>
          {user && <div>{user.name}</div>}
          <Button variant="outline">Logout</Button>
        </div>
      </aside>
      {props.isCentered ? (
        <main className="w-[calc(100vw-240px)] p-6">
          <div className="m-auto max-w-2xl">
            <Outlet />
          </div>
        </main>
      ) : (
        <main className="w-[calc(100vw-240px)] p-6">
          <div className="m-auto max-w-6xl py-12">
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
};

export default LayoutDashboard;
