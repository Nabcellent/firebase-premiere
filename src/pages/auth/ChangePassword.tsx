import { Grid, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { reset } from '../../features/auth/authSlice';
import { lazy, useEffect } from 'react';
import { toast } from '../../utils/helpers';
import { useAppDispatch } from '../../app/hooks';
import { auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Avatar = lazy(() => import('@mui/material/Avatar'));
const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LockOutlined = lazy(() => import('@mui/icons-material/LockOutlined'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    old_password: yup.string().max(20).required('Old password is required.'),
    password: yup.string().max(20).required('New password is required.'),
    password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords do not match')
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [user, loading, error] = useAuthState(auth);

    const formik = useFormik({
        initialValues: {old_password: "", password: "", password_confirmation: ""},
        validationSchema: validationSchema,
        onSubmit: async values => {
            updatePassword(auth.currentUser!, values.password).then(() => {
                console.log('Password changed successfully');

                navigate('/');
            }).catch(err => {
                console.log(err);

                toast({msg: err.message});
            });
        }
    });

    useEffect(() => {
        if (error) toast({msg: error.message, type: 'danger'});
        if (auth.currentUser?.providerData[0]?.providerId !== 'password') navigate('/');

        dispatch(reset());
    }, [user, loading, dispatch]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Grid item display={'flex'} alignItems={'center'}>
                    <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                    <h4 style={{paddingLeft: '1rem'}}>Sign In</h4>
                </Grid>
                <Link to={'/register'}>Sign Up</Link>
            </Grid>
            <Grid item xs={12}>
                <TextField size={'small'} name={'old_password'} label="Current password" fullWidth required
                           placeholder={'Current password'} value={formik.values.old_password}
                           error={formik.touched.old_password && Boolean(formik.errors.old_password)}
                           helperText={formik.touched.old_password && formik.errors.old_password}
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

            <Grid item xs={12} textAlign={'right'}>
                <LoadingButton size="small" color="primary" loading={loading} type={'submit'}
                               loadingPosition="end" className="w-100 mt-3" onClick={() => formik.submitForm()}
                               endIcon={<LoginSharp/>} variant="contained">
                    Sign In
                </LoadingButton>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
