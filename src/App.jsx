import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import AIBaristaChat from './pages/AiBaristaChat';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-cafe-light">
          <Navbar />
          <AIBaristaChat/>
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
