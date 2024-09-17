import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const Header = () => {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="font-medium tracking-tight">Digicommerce.</div>
      <div className="flex items-center gap-6 font-medium">
        <div>Home</div>
        <div>Products</div>
        <Link to="/login">Login</Link>
        <Link to="/register">
          <Button>Join now</Button>
        </Link>
      </div>
    </header>
  );
};
