"use client";

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div>
      <h1>Olá, {user?.name}</h1>
      <p>Este é o seu perfil (renderizado no cliente).</p>
    </div>
  );
}

export default withPageAuthRequired(Home);