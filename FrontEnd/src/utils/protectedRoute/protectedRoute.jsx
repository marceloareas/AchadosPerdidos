import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    console.log("Token:", token); 

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
export default ProtectedRoute;