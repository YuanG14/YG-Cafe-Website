import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Ambient soft-focus color blooms — quiet, sit behind all content */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />
      </div>

      <Navbar />
      <Outlet />
    </div>
  );
}
