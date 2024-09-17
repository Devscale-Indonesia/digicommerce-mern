import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <section className="flex h-screen items-center justify-center">
      <Outlet />
    </section>
  );
};
