"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/providers/userContext';

const WithAuth = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
      console.log('Verificando autorização:', user);

      // Se o usuário não está autenticado, redirecionar para a página de login
      if (!user.isAuthenticated) {
        console.log('Usuário não autenticado. Redirecionando para login.');
        router.replace('/login');
        return;
      }

      // Se o usuário está autenticado, verificar se tem permissão de acesso
      if (allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        if (!showAlert) {
          setShowAlert(true);
          alert('Você não tem permissão para acessar esta página.');
        }
      }
    }, [user, allowedRoles, router, showAlert]);

    // Se a autorização ainda não foi determinada, retornar null para não renderizar nada
    if (isAuthorized === null) {
      return null;
    }

    // Se o usuário não tem permissão, apenas renderize um placeholder ou retorne null para não renderizar nada
    if (isAuthorized === false) {
      return null;
    }

    // Se o usuário é autorizado, renderizar o componente normalmente
    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
