import { useAtomValue } from 'jotai';
import { userAtom } from '../../../lib/auth';

export const Dashboard = () => {
  const user = useAtomValue(userAtom);

  return (
    <main>
      <section>
        <h3>Welcome back, {user?.name}!</h3>
        <p>Here is your dashboard...</p>
      </section>
    </main>
  );
};
