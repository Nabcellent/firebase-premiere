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

function App() {
    return (
        <Routes>
            <Route element={<Middleware.Guest component={<GuestLayout/>}/>}>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/login'} element={<Login/>}/>
            </Route>

            <Route element={<Master/>}>
                <Route index element={<Middleware.Auth component={<Home/>}/>}/>
                <Route path={'/password'} element={<Middleware.Auth component={<ChangePassword/>}/>}/>
            </Route>
        </Routes>
    );
}

export default App;
