import { Outlet } from 'react-router';
import Nav from './Nav';

const Layout = () => {
  return (
    <>
      <Nav />
      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
