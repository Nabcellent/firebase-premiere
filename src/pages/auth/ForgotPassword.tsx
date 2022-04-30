import { Grid, Paper, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { toast } from '../../utils/helpers';
import { auth } from '../../firebase';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

const Avatar = lazy(() => import('@mui/material/Avatar'));
const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LockOutlined = lazy(() => import('@mui/icons-material/LockOutlined'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    email: yup.string().email('Must be a valid email').max(100).required('Email is required.'),
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

    const formik = useFormik({
        initialValues: {email: ""},
        validationSchema: validationSchema,
        onSubmit: async values => {
            await sendPasswordResetEmail(values.email);

            toast({msg: 'Password reset email sent!'});
        }
    });

    useEffect(() => {
        if (error) toast({msg: error.message, type: 'danger'});
    }, [error]);

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} component={Paper} elevation={1} padding={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Grid item display={'flex'} alignItems={'center'}>
                            <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                            <h5 className={'m-0'} style={{paddingLeft: '.5rem'}}>Forgot password</h5>
                        </Grid>
                        <Link to={'/'}>Sign In</Link>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField size={'small'} name={'email'} label="Email address" fullWidth required
                                   placeholder={'Email address'} value={formik.values.email}
                                   error={formik.touched.email && Boolean(formik.errors.email)}
                                   helperText={formik.touched.email && formik.errors.email}
                                   onChange={formik.handleChange}/>
                    </Grid>

                    <Grid item xs={12} textAlign={'right'}>
                        <LoadingButton size="small" color="primary" loading={sending} type={'submit'}
                                       loadingPosition="end" className="w-100 mt-3" onClick={() => formik.submitForm()}
                                       endIcon={<LoginSharp/>} variant="contained">
                            Change Password
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ForgotPassword;
