import { Grid, Paper, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { toast } from '../../utils/helpers';
import { auth } from '../../firebase';
import { useUpdatePassword } from 'react-firebase-hooks/auth';

const Avatar = lazy(() => import('@mui/material/Avatar'));
const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LockOutlined = lazy(() => import('@mui/icons-material/LockOutlined'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    old_password: yup.string().max(20).required('Old password is required.'),
    password: yup.string().max(20).required('New password is required.'),
    password_confirmation: yup.string().oneOf([
        yup.ref('password'),
        null
    ], 'Passwords do not match').required('Password confirmation is required')
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const [updatePassword, updating, error] = useUpdatePassword(auth);

    const formik = useFormik({
        initialValues: {old_password: "", password: "", password_confirmation: ""},
        validationSchema: validationSchema,
        onSubmit: async values => {
            await updatePassword(values.password);

            toast({msg: 'Password changed successfully'});

            navigate('/');
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
                            <h4 style={{paddingLeft: '1rem'}}>Change password</h4>
                        </Grid>
                        <Link to={'/'}>Back home</Link>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type={'password'} size={'small'} name={'old_password'} label="Current password"
                                   fullWidth required placeholder={'Current password'}
                                   value={formik.values.old_password} onChange={formik.handleChange}
                                   error={formik.touched.old_password && Boolean(formik.errors.old_password)}
                                   helperText={formik.touched.old_password && formik.errors.old_password}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField type={'password'} size={'small'} name={'password'} label="New Password" fullWidth
                                   required placeholder={'New Password'} value={formik.values.password}
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
                        <LoadingButton size="small" color="primary" loading={updating} type={'submit'}
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

export default ChangePassword;
