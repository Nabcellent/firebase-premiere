import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';

const Guest = ({component}: { component: JSX.Element }) => {
    const location = useLocation();

    console.log(auth.currentUser);

    if (auth.currentUser) {
        // Redirect them to the /home page.

        // @ts-ignore
        let urlIntended: string = location.state?.from?.pathname || "/";
        return <Navigate to={urlIntended} replace/>;
    }

    return component;
};

export default Guest;