import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from './layout.auth';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/login';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    mutate: handleSubmitLogin,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationKey: ['login'],
    mutationFn: () => loginUser({ email, password }),
    onSuccess: () => navigate('/dashboard'),
  });

  return (
    <AuthLayout>
      <div className="w-[300px] space-y-4">
        <section>
          <h3>Login</h3>
          <p>Welcome back!</p>
        </section>
        <div className="space-y-2">
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <Button isFullwidth={true} disabled={isPending} onClick={() => handleSubmitLogin()}>
            Login
          </Button>
          {isError && <div className="text-center text-sm font-medium text-rose-600">{error?.message}</div>}
        </div>
        <div>
          Don't have an account ? <Link to="/register">Register</Link>
        </div>
      </div>
    </AuthLayout>
  );
};
