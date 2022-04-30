import { Grid, Paper, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { lazy, useEffect, useState } from 'react';
import { toast } from '../../utils/helpers';
import { auth } from '../../firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { PageLoader } from '../../components/PageLoader';

const Avatar = lazy(() => import('@mui/material/Avatar'));
const LoadingButton = lazy(() => import('@mui/lab/LoadingButton'));
const LockOutlined = lazy(() => import('@mui/icons-material/LockOutlined'));
const LoginSharp = lazy(() => import('@mui/icons-material/LoginSharp'));

const validationSchema = yup.object({
    password: yup.string().max(20).required('New password is required.'),
    password_confirmation: yup.string().oneOf([
        yup.ref('password'),
        null
    ], 'Passwords do not match').required('Password confirmation is required')
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [oobCode, setOobCode] = useState("");

    const formik = useFormik({
        initialValues: {password: "", password_confirmation: ""},
        validationSchema: validationSchema,
        onSubmit: async values => {
            setResetting(true);

            try {
                await confirmPasswordReset(auth, oobCode, values.password);

                toast({msg: 'Password reset successfully'});

                navigate('/');
            } catch (err: any) {
                toast({msg: err.message, type: 'danger'});
            }

            setResetting(false);
        }
    });

    const verifyPasswordResetLink = (code: string) => {
        verifyPasswordResetCode(auth, code).then(res => {
            console.log(res);
            setVerified(true);
            setVerifying(false);
        }).catch(err => toast({msg: err.message}));
    };

    useEffect(() => {
        if (searchParams) {
            let oobCode = searchParams.get('oobCode');
            setOobCode(String(oobCode));

            oobCode ? verifyPasswordResetLink(oobCode) : toast({msg: 'Invalid code'});
        } else {
            toast({msg: 'Invalid code'});
        }
    },);

    return (
        <Grid container alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} component={Paper} elevation={1} padding={3}>
                <Grid container spacing={2}>

                    {
                        verifying ? <PageLoader/>
                            :
                            <>
                                {
                                    verified ?
                                        <>
                                            <Grid item xs={12} display={'flex'} alignItems={'center'}
                                                  justifyContent={'space-between'}>
                                                <Grid item display={'flex'} alignItems={'center'}>
                                                    <Avatar><LockOutlined fontSize={'small'}/></Avatar>
                                                    <h5 className={'m-0'} style={{paddingLeft: '.5rem'}}>Reset
                                                        password</h5>
                                                </Grid>
                                                <Link to={'/'}>Back home</Link>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField type={'password'} size={'small'} name={'password'}
                                                           label="New Password" fullWidth
                                                           required placeholder={'New Password'}
                                                           value={formik.values.password}
                                                           error={formik.touched.password && Boolean(formik.errors.password)}
                                                           helperText={formik.touched.password && formik.errors.password}
                                                           onChange={formik.handleChange}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField type={'password'} size={'small'}
                                                           name={'password_confirmation'}
                                                           label="Confirm Password" fullWidth
                                                           required placeholder={'Confirm Password'}
                                                           value={formik.values.password_confirmation}
                                                           error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
                                                           helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
                                                           onChange={formik.handleChange}/>
                                            </Grid>

                                            <Grid item xs={12} textAlign={'right'}>
                                                <LoadingButton size="small" color="primary" loading={resetting}
                                                               type={'submit'} loadingPosition="end"
                                                               className="w-100 mt-3"
                                                               onClick={() => formik.submitForm()}
                                                               endIcon={<LoginSharp/>} variant="contained">
                                                    Change Password
                                                </LoadingButton>
                                            </Grid>
                                        </>
                                        : <p>Invalid verification code!</p>

                                }
                            </>
                    }

                </Grid>
            </Grid>
        </Grid>
    );
};

export default ResetPassword;
