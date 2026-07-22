import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { CafeNew } from './pages/CafeNew';
import { CafeDetail } from './pages/CafeDetail';
import { CafeEdit } from './pages/CafeEdit';
import { Wishlist } from './pages/Wishlist';
import { RandomDate } from './pages/RandomDate';
import { Stats } from './pages/Stats';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

function App() {
  return (
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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
