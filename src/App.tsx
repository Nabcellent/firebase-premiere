import './App.css';
import { Route, Routes } from 'react-router-dom';
import PhoneLogin from './pages/auth/PhoneLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Middleware from './middleware';
import Register from './pages/auth/Register';
import GuestLayout from './layouts/GuestLayout';
import Master from './layouts/Master';
import EmailLogin from './pages/auth/EmailLogin';

function App() {
    return (
        <Routes>
            <Route element={<Middleware.Guest component={<GuestLayout/>}/>}>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/login'} element={<EmailLogin/>}/>
                <Route path={'/login/phone'} element={<PhoneLogin/>}/>
            </Route>

            <Route element={<Master/>}>
                <Route index element={<Middleware.Auth component={<Home/>}/>}/>
            </Route>
        </Routes>
    );
}

export default App;
