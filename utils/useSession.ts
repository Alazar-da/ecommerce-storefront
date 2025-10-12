import { useState, useEffect } from "react";
import { fetchSession } from "./fetchSession";
import { useRouter } from "next/navigation";



export const useSession = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const u = await fetchSession();
      setUser(u);
    };
    getSession();
  }, []);

  return { user };
};

export const signOut = () => {
  // 1. Remove the token
  localStorage.removeItem("token");
  const router = useRouter();

  // 3. Redirect to login page
  router.push("/");
};
