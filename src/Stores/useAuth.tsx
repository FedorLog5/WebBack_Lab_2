import { useSelector } from "react-redux";
import { RootState } from "./Store"; 

export const useAuth = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const roles = useSelector((state: RootState) => state.auth.roles);

  return { token, isAuthenticated, roles };
};
