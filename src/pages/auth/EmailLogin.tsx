import { Grid, Paper, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { login, reset } from '../../features/auth/authSlice';
import { lazy, useEffect } from 'react';
import { toast } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../app/hooks';

const Avatar = lazy(() => import('@mui/material/Avatar'));
const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LockOutlined = lazy(() => import('@mui/icons-material/LockOutlined'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    email: yup.string().email('Must be a valid email').max(100).required('Email is required.'),
    password: yup.string().max(20).required('Password is required.')
});

const EmailLogin = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user, isLoading, isError, isSuccess, message } = useAuth();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: validationSchema,
        onSubmit: values => dispatch(login(values))
    });

    useEffect(() => {
        if (isError) toast({ msg: message, type: 'danger' });
        if (isSuccess || user) navigate('/');

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} component={Paper} elevation={1} padding={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item display={'flex'} alignItems={'center'}>
                            <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                            <h4 style={{ paddingLeft: '1rem' }}>Sign In</h4>
                        </Grid>
                        <Link to={'/register'}>Sign Up</Link>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField size={'small'} name={'email'} label="Email address" fullWidth required
                                   placeholder={'Email address'} value={formik.values.email}
                                   error={formik.touched.email && Boolean(formik.errors.email)}
                                   helperText={formik.touched.email && formik.errors.email}
                                   onChange={formik.handleChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type={'password'} size={'small'} name={'password'} label="Password" fullWidth
                                   required placeholder={'Password'} value={formik.values.password}
                                   error={formik.touched.password && Boolean(formik.errors.password)}
                                   helperText={formik.touched.password && formik.errors.password}
                                   onChange={formik.handleChange}/>
                    </Grid>
                    <Grid item xs={12} textAlign={'right'}>
                        <LoadingButton size="small" color="primary" loading={isLoading} type={'submit'}
                                       loadingPosition="end" className="w-100 mt-3" onClick={() => formik.submitForm()}
                                       endIcon={<LoginSharp/>} variant="contained">
                            Sign In
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default EmailLogin;
