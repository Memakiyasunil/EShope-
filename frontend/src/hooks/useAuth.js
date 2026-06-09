import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logout,
  clearError,
  fetchCurrentUser,
} from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, accessToken } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);

  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch]);

  const refreshUser = useCallback(
    () => dispatch(fetchCurrentUser()),
    [dispatch]
  );

  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller' || user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    loading,
    error,
    accessToken,
    login,
    register,
    signOut,
    clearAuthError,
    refreshUser,
    isAdmin,
    isSeller,
  };
};

export default useAuth;
