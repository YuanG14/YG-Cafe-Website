import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { Wishlist } from './pages/Wishlist';
import { RandomDate } from './pages/RandomDate';
import { Stats } from './pages/Stats';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/random" element={<RandomDate />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
