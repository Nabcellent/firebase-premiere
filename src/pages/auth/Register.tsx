import * as yup from 'yup';
import { useFormik } from 'formik';
import { lazy, useEffect } from 'react';
import { RootState } from '../../app/store';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { reset } from '../../features/auth/authSlice';
import { toast } from '../../utils/helpers';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/AuthContainer';

const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    email: yup.string().email('Must be a valid email').max(100).required('Email is required.'),
    password: yup.string().max(20).required('Password is required.'),
    password_confirmation: yup.string().max(20).required('Password is required.')
});

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {user, isLoading, isError, isSuccess, message} = useAppSelector((state: RootState) => state.auth);

    const formik = useFormik({
        initialValues: {email: "", password: "", password_confirmation: ""},
        validationSchema: validationSchema,
        onSubmit: values => {
            createUserWithEmailAndPassword(auth, values.email, values.password).then(res => {
                console.log(res);

                navigate('/login');
            }).catch(err => {
                console.log(err);

                if (err.code.includes('auth/weak-password')) console.log('Please provide as stronger password.');
                if (err.code.includes('auth/email-already-in-use')) console.log('Email already in use.');
            });
        }
    });

    useEffect(() => {
        if (isError) toast({msg: message, type: 'danger'});
        if (isSuccess || auth) navigate('/');

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    return (
        <AuthContainer header={'Register'}>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <input className="form-control" type="email" value={formik.values.email}
                           name={'email'} autoFocus required
                           placeholder="Email address" onChange={formik.handleChange}/>
                    <small className={'text-danger'}>{formik.touched.email && formik.errors.email}</small>
                </div>
                <div className="mb-3">
                    <input className="form-control" type="password" value={formik.values.password}
                           name={'password'} onChange={formik.handleChange} placeholder="Password"
                           required/>
                    <small className={'text-danger'}>{formik.touched.password && formik.errors.password}</small>
                </div>
                <div className="mb-3">
                    <input className="form-control" type="password" value={formik.values.password_confirmation}
                           name={'password_confirmation'} onChange={formik.handleChange} placeholder="Confirm Password"
                           required/>
                    <small
                        className={'text-danger'}>{formik.touched.password_confirmation && formik.errors.password_confirmation}</small>
                </div>
                <div className="row flex-between-center">
                    <div className="col-auto">
                        <div className="form-check mb-0">
                            <input className="form-check-input" type="checkbox"
                                   id="basic-checkbox" defaultChecked={true}/>
                            <label className="form-check-label mb-0" htmlFor="basic-checkbox">Remember me</label>
                        </div>
                    </div>
                    <div className="col-auto">
                        <Link className="fs--1" to="/login">Forgot Password?</Link>
                    </div>
                </div>
                <div className="mb-3">
                    <LoadingButton size="small" color="primary" loading={isLoading} type={'submit'}
                                   loadingPosition="end" className="w-100 mt-3" onClick={() => formik.submitForm()}
                                   endIcon={<LoginSharp/>} variant="contained">
                        Sign Up
                    </LoadingButton>
                </div>

                <small className={'m-1 text-center'}>Already have an account? <Link to={'/login'}></Link></small>
            </form>
        </AuthContainer>
    );
};

export default Register;
