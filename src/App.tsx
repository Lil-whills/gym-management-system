import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { router } from './app/router';

export function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </ToastProvider>
  );
}

export default App;
