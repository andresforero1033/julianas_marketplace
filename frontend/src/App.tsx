import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-light text-text">
      <Outlet />
    </div>
  );
}

export default App;
