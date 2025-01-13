'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from './login/page';


export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return (
    <Login />
  );
}
