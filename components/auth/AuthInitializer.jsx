'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../store/slices/authSlice';

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return null;
}
