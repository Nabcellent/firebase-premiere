import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../../firebase';
import { useEffect } from 'react';
import { ApplicationVerifier } from 'firebase/auth';

const PhoneLogin = () => {
    let appVerifier: ApplicationVerifier;
    useEffect(() => {
        appVerifier = new RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            defaultCountry: 'KE'
        }, auth);
    });


    const handleClick = () => {
        let number = '+254110039317';

        signInWithPhoneNumber(auth, number, appVerifier).then(function (res) {
            let code = prompt('Enter the otp', '');

            if (code === null) return;

            res.confirm(code).then(result => {
                console.log(result.user);

                document.querySelector('label')!.textContent = result.user?.phoneNumber + " Number verified";
            }).catch(err => console.log(err));
        });
    };

    return (
        <div>
            <div id="recaptcha-container"></div>

            <label htmlFor="test"></label>

            <button onClick={handleClick}>Click here</button>
        </div>
    );
};

export default PhoneLogin;
