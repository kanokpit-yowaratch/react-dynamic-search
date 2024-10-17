import { useRoutes } from 'react-router-dom';
import UserList from './pages/user/UserList';
import UserAltList from './pages/userAlt/UserList';

function App() {
  const element = useRoutes([
    { path: '/', element: <UserList /> },
    { path: '/alt', element: <UserAltList /> },
  ]);
  return element;
}

export default App;
