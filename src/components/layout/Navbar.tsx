import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/random', label: 'Pick for Us' },
  { to: '/stats', label: 'Our Story' },
];

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-pill glass-panel border border-white/60 px-4 py-2 shadow-soft">
        <NavLink to="/" className="flex items-center gap-2 pl-2 pr-1 shrink-0">
          <span
            className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm"
            aria-hidden="true"
          >
            ☕
          </span>
          <span className="font-display text-lg font-semibold text-ink hidden sm:inline">
            Our Cafe Journal
          </span>
        </NavLink>

        <ul className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="shrink-0">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center rounded-pill px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-ink shadow-soft'
                      : 'text-ink-soft hover:text-ink hover:bg-blush'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {user && (
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center rounded-pill bg-gold-soft px-2.5 py-1 text-xs font-medium text-gold">
                Admin
              </span>
            )}
            <button
              type="button"
              onClick={() => signOut()}
              title={`Log out of ${user.email}`}
              className="inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-xs sm:text-sm font-medium text-ink-soft hover:text-ink hover:bg-blush transition-colors duration-200"
            >
              <span aria-hidden="true">↩</span>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
