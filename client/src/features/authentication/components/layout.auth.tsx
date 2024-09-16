import React from 'react';

export const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return <section className="flex h-screen items-center justify-center">{children}</section>;
};
