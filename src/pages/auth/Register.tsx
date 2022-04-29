import * as yup from 'yup';
import { useFormik } from 'formik';
import { lazy, useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { reset } from '../../features/auth/authSlice';
import { toast } from '../../utils/helpers';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, Grid, Paper, TextField } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

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

    const {user, isLoading, isError, isSuccess, message} = useAuth();

    const formik = useFormik({
        initialValues: {email: "", password: "", password_confirmation: ""},
        validationSchema: validationSchema,
        onSubmit: values => {
            createUserWithEmailAndPassword(auth, values.email, values.password).then(res => {
                console.log(res);

                navigate('/login');
            }).catch(err => {
                console.log(err);

                if (err.code.includes('auth/weak-password')) toast({
                    msg: 'Please provide as stronger password.',
                    type: 'danger'
                });
                if (err.code.includes('auth/email-already-in-use')) toast({
                    msg: 'Email already in use.',
                    type: 'danger'
                });
            });
        }
    });

    useEffect(() => {
        if (isError) toast({msg: message, type: 'danger'});
        if (isSuccess || user) navigate('/');

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={1} padding={3}>
                <Grid component={'form'} onSubmit={formik.handleSubmit} container spacing={2}>
                    <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item display={'flex'} alignItems={'center'}>
                            <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                            <h4 style={{paddingLeft: '1rem'}}>Sign Up</h4>
                        </Grid>
                        <Link to={'/login'}>Sign In</Link>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField size={'small'} name={'email'} label="Email address" fullWidth required
                                   placeholder={'Email address'} value={formik.values.email}
                                   error={formik.touched.email && Boolean(formik.errors.email)}
                                   helperText={formik.touched.email && formik.errors.email}
                                   onChange={formik.handleChange}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField type={'password'} size={'small'} name={'password'} label="Password" fullWidth
                                   required placeholder={'Password'} value={formik.values.password}
                                   error={formik.touched.password && Boolean(formik.errors.password)}
                                   helperText={formik.touched.password && formik.errors.password}
                                   onChange={formik.handleChange}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField type={'password'} size={'small'} name={'password_confirmation'}
                                   label="Confirm Password" fullWidth
                                   required placeholder={'Confirm Password'} value={formik.values.password_confirmation}
                                   error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
                                   helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
                                   onChange={formik.handleChange}/>
                    </Grid>
                    <Grid item xs={12} className="mb-3">
                        <LoadingButton size="small" color="primary" loading={isLoading} type={'submit'}
                                       loadingPosition="end" className="w-100 mt-3" onClick={() => formik.submitForm()}
                                       endIcon={<LoginSharp/>} variant="contained">
                            Sign Up
                        </LoadingButton>
                    </Grid>

                    <Grid item xs={12} textAlign={'center'}>
                        <small className={'m-1 text-center'}>Already have an account? <Link to={'/login'}>Sign In</Link></small>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Register;
