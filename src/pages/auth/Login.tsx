import { Divider, Grid, Paper, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { toast } from '../../utils/helpers';
import { auth, signInWithGoogle, signInWithPhone } from '../../firebase';
import { ApplicationVerifier, RecaptchaVerifier } from 'firebase/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

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
    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

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
        if (error) toast({msg: error.message, type: 'danger'});
        if (user) navigate('/');
    }, [user, error]);

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} component={Paper} elevation={1} padding={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item display={'flex'} alignItems={'center'}>
                            <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                            <h4 style={{paddingLeft: '1rem'}}>Sign In</h4>
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
                    <Grid item xs={12}><Divider/></Grid>
                    <Grid item xs={6} textAlign={'center'}>
                        <LoadingButton size="small" color="secondary" variant="contained"
                                       onClick={signInWithPhoneNumber}>
                            Use Phone
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={6} textAlign={'center'}>
                        <LoadingButton size="small" color="primary" variant="contained"
                                       onClick={() => signInWithGoogle()}>Use Google</LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Login;
