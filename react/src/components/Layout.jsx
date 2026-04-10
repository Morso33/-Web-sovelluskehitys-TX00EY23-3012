import { Link, Outlet } from 'react-router';

const Layout = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/upload">Upload</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
