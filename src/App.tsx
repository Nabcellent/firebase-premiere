import './App.css';
import { Route, Routes } from 'react-router-dom';
import PhoneLogin from './pages/auth/PhoneLogin';
import 'bootstrap';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Middleware from './middleware';
import GuestLayout from './layouts/GuestLayout';
import Master from './layouts/Master';

function App() {
    return (
        <Routes>
            <Route element={<Middleware.Guest component={<GuestLayout/>}/>}>
                <Route path={'/login/phone'} element={<PhoneLogin/>}/>
                <Route path={'/register'} element={<Register/>}/>
            </Route>

            <Route element={<Middleware.Auth component={<Master/>}/>}>
                <Route path={'/'} element={<Home/>}/>
            </Route>
        </Routes>
    );
}

export default App;
