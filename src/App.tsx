import './App.css';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Middleware from './middleware';
import Register from './pages/auth/Register';
import GuestLayout from './layouts/GuestLayout';
import Master from './layouts/Master';
import Login from './pages/auth/Login';
import ChangePassword from './pages/auth/ChangePassword';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { PageLoader } from './components/PageLoader';
import { useEffect } from 'react';
import { toast } from './utils/helpers';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (error) toast({msg: error.message, type: 'danger'});
        user ? console.log('user detected') : console.log('no user detected')
    }, [user, error])

    if (loading) return <PageLoader/>;

    return (
        <Routes>
            <Route element={<Middleware.Guest component={<GuestLayout/>}/>}>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/password/forgot'} element={<ForgotPassword/>}/>
                <Route path={'/password/reset'} element={<ResetPassword/>}/>
            </Route>

            <Route element={<Master/>}>
                <Route index element={<Middleware.Auth component={<Home/>}/>}/>
                <Route path={'/password/change'} element={<Middleware.Auth component={<ChangePassword/>}/>}/>
            </Route>
        </Routes>
    );
}

export default App;
