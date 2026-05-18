'use client';
import { useDispatch, useSelector } from 'react-redux';
import LoginModal from './LoginModal';
import { closeLoginModal } from '../../store/slices/uiSlice';

export default function LoginModalLayer() {
  const dispatch = useDispatch();
  const loginOpen = useSelector((s) => s.ui.loginModalOpen);

  return <LoginModal open={loginOpen} onClose={() => dispatch(closeLoginModal())} />;
}
