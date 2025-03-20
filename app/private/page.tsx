"use client";

import { ROLES } from "@/constants/roles";
import { useAuth } from "@/context/AuthContext";
import { forbidden } from "next/navigation";

export default function PrivatePage() {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="size-full flex flex-row justify-center items-center">
        Betöltés...
      </div>
    );
  }

  if (userRole !== ROLES.ADMIN) {
    forbidden();
  }

  return (
    <div className="size-full flex flex-row justify-center items-center">
      Admin page
    </div>
  );
}
