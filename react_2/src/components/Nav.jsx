import { Link } from 'react-router';
import { useUserContext } from '../contexts/UserContext';

const DEMO_USER = {
  user_id: 1,
  username: 'testuser',
  role: 'user',
  token: 'demo-token',
};

const Nav = () => {
  const { user, setUser } = useUserContext();

  return (
    <nav className="border-b border-[var(--border)] px-6 py-3">
      <ul className="flex list-none gap-6 p-0 m-0 items-center">
        <li>
          <Link
            to="/"
            className="text-[var(--text-h)] font-medium no-underline hover:text-[var(--accent)] transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="text-[var(--text-h)] font-medium no-underline hover:text-[var(--accent)] transition-colors"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/upload"
            className="text-[var(--text-h)] font-medium no-underline hover:text-[var(--accent)] transition-colors"
          >
            Upload
          </Link>
        </li>
        <li className="ml-auto">
          {user ? (
            <button
              onClick={() => setUser(null)}
              className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] px-4 py-1.5 text-sm hover:shadow-[var(--shadow)] transition-shadow"
            >
              Logout ({user.username})
            </button>
          ) : (
            <button
              onClick={() => setUser(DEMO_USER)}
              className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] px-4 py-1.5 text-sm hover:shadow-[var(--shadow)] transition-shadow"
            >
              Login (demo)
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
