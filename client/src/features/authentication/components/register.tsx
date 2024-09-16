import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { AuthLayout } from './layout.auth';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/register';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    mutate: handleSubmitRegister,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationKey: ['signup'],
    mutationFn: () => registerUser({ name, email, password }),
  });
  return (
    <AuthLayout>
      <div className="w-[300px] space-y-6">
        <section>
          <h3>Register</h3>
          <p>Please create an account to continue</p>
        </section>
        <div className="space-y-2">
          <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <Button isFullwidth onClick={() => handleSubmitRegister()} disabled={isPending}>
            Register
          </Button>
          {isError && <div className="text-center text-sm font-medium text-rose-600">{error?.message}</div>}
        </div>
        <div>
          Have an account ? <Link to="/login">Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
};
