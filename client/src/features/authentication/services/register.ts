interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterArgs) {
  const res = await fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (res.status === 400) {
    throw new Error('Name, email and password are required');
  }

  if (res.status === 409) {
    throw new Error('User already exists');
  }

  const data = await res.json();
  return data;
}
