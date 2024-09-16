interface LoginUserArgs {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LoginUserArgs) {
  const res = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401) {
    throw new Error('Invalid email or password');
  }

  const data = await res.json();
  return data;
}
