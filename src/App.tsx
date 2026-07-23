import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';
import { PageLoader } from './components/layout/PageLoader';

// Every route is its own chunk — only the page the person is actually on
// (plus shared layout/UI code) needs to download, instead of the whole app.
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Collection = lazy(() => import('./pages/Collection').then((m) => ({ default: m.Collection })));
const CafeNew = lazy(() => import('./pages/CafeNew').then((m) => ({ default: m.CafeNew })));
const CafeDetail = lazy(() => import('./pages/CafeDetail').then((m) => ({ default: m.CafeDetail })));
const CafeEdit = lazy(() => import('./pages/CafeEdit').then((m) => ({ default: m.CafeEdit })));
const Wishlist = lazy(() => import('./pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const RandomDate = lazy(() => import('./pages/RandomDate').then((m) => ({ default: m.RandomDate })));
const Stats = lazy(() => import('./pages/Stats').then((m) => ({ default: m.Stats })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));
const Unauthorized = lazy(() => import('./pages/Unauthorized').then((m) => ({ default: m.Unauthorized })));
const Forbidden = lazy(() => import('./pages/Forbidden').then((m) => ({ default: m.Forbidden })));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public — only reachable when signed out */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private — the journal itself, only reachable when signed in */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/new" element={<CafeNew />} />
            <Route path="/collection/:id" element={<CafeDetail />} />
            <Route path="/collection/:id/edit" element={<CafeEdit />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/random" element={<RandomDate />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
