import { useRouter } from "next/router";
import { useAuth } from "../components/AuthProvider";
import { useEffect } from "react";

const withAuth = (Component) => {
  return (props) => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        router.push("/auth");
      }
    }, [currentUser, router]);

    if (!currentUser) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};
withAuth.displayName = 'withAuth';

export default withAuth;
