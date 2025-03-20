"use client";

import { logout } from "./logout/actions";
import { useRouter } from "next/navigation";
import Posts from "@/components/Posts";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-start items-center w-full h-screen">
      <nav className="flex flex-row justify-between items-center py-2 px-6 gap-x-2 border-b border-b-slate-800 w-full">
        <div className="flex flex-row gap-x-6 justify-start items-center">
          <button
            className="hover:text-slate-300 cursor-pointer"
            onClick={() => router.push("/private")}
          >
            Admin
          </button>
          <button className="hover:text-slate-300 cursor-pointer">
            Moderátor
          </button>
          <button className="hover:text-slate-300 cursor-pointer">
            Felhasználó
          </button>
        </div>
        <div>
          <form>
            <button
              className="hover:text-slate-300 cursor-pointer"
              formAction={logout}
            >
              Kijelentkezés
            </button>
          </form>
        </div>
      </nav>
      {!isLoading && <Posts userRole={userRole} user={user} />}
    </div>
  );
}
