import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './Stores/Store.tsx';

createRoot(document.getElementById('root')!).render(
      <Provider store={store}>
            <App />
      </Provider>
)