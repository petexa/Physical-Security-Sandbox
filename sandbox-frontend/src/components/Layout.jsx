import NavBar from './NavBar';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <NavBar />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
