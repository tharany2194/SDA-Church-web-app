'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../store/slices/authSlice';
import Cookies from 'js-cookie';

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return null;
}
