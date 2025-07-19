'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button"; 
import { LogIn, LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
        )}
        <p className="text-sm hidden sm:block">Olá, {session.user?.name}</p>
        <Button onClick={() => signOut()} variant="outline" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("google")} variant="outline" size="sm">
      <LogIn className="mr-2 h-4 w-4" />
      Login com Google
    </Button>
  );
}