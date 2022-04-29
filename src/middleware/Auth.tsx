import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import moment from 'moment';
import { login } from '../features/auth/authSlice';
import { useAppDispatch } from '../app/hooks';

const Auth = ({component}: { component: JSX.Element }) => {
    const {auth} = useAuth();
    const location = useLocation();
    const dispatch = useAppDispatch();

    if (!auth) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they log in, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={ {from: location} } replace/>;
    }

    const expiresIn = moment.unix(auth.user.exp).diff(moment(), 'minutes');
    console.log(`Session expires in: ${expiresIn}minutes`);

    if (expiresIn < 1) dispatch(login(auth.credentials));

    return component;
};

export default Auth;