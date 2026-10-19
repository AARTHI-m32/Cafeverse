import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartQuantity = useSelector(state => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-cafe-dark text-cafe-light p-4 shadow-md fixed w-full z-20 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider text-cafe-accent">CafeVerse</Link>
        <div className="space-x-4 md:space-x-6 flex items-center font-medium">
          <Link to="/" className="hover:text-cafe-accent transition-colors hidden sm:block">Home</Link>
          <Link to="/menu" className="hover:text-cafe-accent transition-colors">Menu</Link>
          <Link to="/cart" className="hover:text-cafe-accent transition-colors relative">
            Cart
            {cartQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-cafe-DEFAULT text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartQuantity}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/reservations" className="hover:text-cafe-accent transition-colors hidden md:block">Reservations</Link>
              <Link to="/orders" className="hover:text-cafe-accent transition-colors hidden md:block">Orders</Link>
              {user?.role === 'ROLE_ADMIN' && <Link to="/admin" className="hover:text-cafe-accent transition-colors text-yellow-500">Admin</Link>}
              <button onClick={handleLogout} className="hover:text-cafe-accent transition-colors text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-cafe-accent transition-colors">Login</Link>
              <Link to="/register" className="bg-cafe-DEFAULT px-4 py-2 rounded hover:bg-cafe-accent transition-colors text-white hidden sm:block">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
