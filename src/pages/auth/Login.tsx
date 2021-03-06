import { Divider, Grid, Paper, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { toast } from '../../utils/helpers';
import { auth, signInWithPhone } from '../../firebase';
import { ApplicationVerifier, RecaptchaVerifier } from 'firebase/auth';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Google, PhoneAndroid } from '@mui/icons-material';

const Avatar = lazy(() => import('@mui/material/Avatar'));
const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LockOutlined = lazy(() => import('@mui/icons-material/LockOutlined'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    email: yup.string().email('Must be a valid email').max(100).required('Email is required.'),
    password: yup.string().max(20).required('Password is required.')
});

const Login = () => {
    const navigate = useNavigate();
    let [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
    let [signInWithGoogle, userG, loadingG, errorG] = useSignInWithGoogle(auth);


    const formik = useFormik({
        initialValues: {email: "", password: ""},
        validationSchema: validationSchema,
        onSubmit: ({email, password}) => signInWithEmailAndPassword(email, password)
    });

    const signInWithPhoneNumber = async () => {
        let appVerifier: ApplicationVerifier = new RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            defaultCountry: 'KE'
        }, auth);

        await signInWithPhone({phone: '+254110039317', appVerifier});
    };

    useEffect(() => {
        if (error || errorG) toast({msg: String(error?.message || errorG?.message), type: 'danger'});
        if (user || userG) navigate('/');
    }, [user, error]);

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} component={Paper} elevation={1} padding={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item display={'flex'} alignItems={'center'}>
                            <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                            <h5 className={'m-0'} style={{paddingLeft: '.5rem'}}>Sign In</h5>
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
                    <div id="recaptcha-container"></div>
                    <Grid item xs={12} textAlign={'right'}>
                        <LoadingButton size="small" color="primary" loading={loading} type={'submit'}
                                       loadingPosition="end" className="w-100 mt-3" onClick={() => formik.submitForm()}
                                       endIcon={<LoginSharp/>} variant="contained">
                            Sign In
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={12} textAlign={'center'}>
                        <small><Link to={'/password/forgot'}>Forgot password?</Link></small>
                        <Divider/>
                    </Grid>
                    <Grid item xs={6} textAlign={'center'}>
                        <LoadingButton size="small" color="secondary" variant="contained"
                                       onClick={signInWithPhoneNumber} startIcon={<PhoneAndroid/>}>
                            Use Phone
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={6} textAlign={'center'}>
                        <LoadingButton size="small" color={'error'} loading={loadingG} variant="contained"
                                       startIcon={<Google/>} onClick={() => signInWithGoogle()}>
                            Use Google
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Login;
