import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setTheme, toggleTheme, selectTheme } from '../store/slices/themeSlice';

const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectTheme);

  const isDark = mode === 'dark';

  const setMode = useCallback(
    (theme) => dispatch(setTheme(theme)),
    [dispatch]
  );

  const toggle = useCallback(() => dispatch(toggleTheme()), [dispatch]);

  return { mode, isDark, setMode, toggle };
};

export default useTheme;
