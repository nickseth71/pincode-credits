import { Form, FormLayout, Toast, TextField, Button, Frame } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import HttpRequest from '../utility/HttpRequest';
import { useNavigate } from '@shopify/app-bridge-react';

export function IndexForm() {
    const [active, setActive] = useState(false);
    const [_isError, SetError] = useState(false);
    const [ToastMessage, SetToast] = useState('');
    const [value, setValue] = useState({
        email: '',
        name: '',
        password: '',
    })
    const navigate = useNavigate();
    const [result, setResult] = useState(false)

    // useEffect(() => {
    //     if (result) {
    //         window.location.reload(false)
    //     }
    // }, [result])

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const toastMarkup = active ? (
        _isError ? <Toast content={ToastMessage} error duration={3000} onDismiss={toggleActive} />
            : <Toast content={ToastMessage} duration={3000} onDismiss={toggleActive} />
    ) : null;


    const handleSubmit = async () => {
        let lastAtPos = value.email.lastIndexOf('@');
        let lastDotPos = value.email.lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && value.email.indexOf('@@') == -1 && lastDotPos > 2 && (value.email.length - lastDotPos) > 2)) {
            SetError(_isError => true);
            SetToast(ToastMessage => 'Please, Enter your valid Email!');
            setActive((active) => !active);
            return;
            // setClasses(prevState => prevState + ' error');
        } else if (value.password == '') {
            SetError(_isError => true);
            SetToast(ToastMessage => 'Please, Enter your password!');
            setActive((active) => !active);
            return;
        } else {
            const formData = new FormData();
            formData.append("email", value.email);
            var merchant_profile_by_email = await HttpRequest('https://pincodecredits.com/PincodeAdmin/API/V1/merchant_profile_by_email', 'POST', formData)
            var ress = merchant_profile_by_email[0];
            console.log('merchant_profile_by_email>>>', merchant_profile_by_email);
            if (value.password != ress.data[0].password || ress.res !== "success") {
                SetError(_isError => true);
                SetToast(ToastMessage => 'Email or Password is incorrect! 😔');
                setActive((active) => !active);
                sessionStorage.setItem("isMerchantLoggedIn", false);
                sessionStorage.setItem("merchantBrandId", '');
                return;
            }
            if (ress.res === "success") {
                sessionStorage.setItem("isMerchantLoggedIn", true);
                sessionStorage.setItem("merchantBrandId", ress.data[0].id);
                SetError(_isError => false);
                SetToast(ToastMessage => 'Login Successfully! 🎉');
                setActive((active) => !active);
            }
            navigate('/DashBoardPage');
        }
    };

    return (
        <Form noValidate={false} onSubmit={handleSubmit}>
            {toastMarkup}
            <FormLayout>
                <TextField
                    value={value.name}
                    onChange={(val) => setValue({ ...value, name: val })}
                    label="Name"
                    type="text"
                    autoComplete='name'
                    helpText={
                        <span></span>
                    }
                />
                <TextField
                    value={value.email}
                    onChange={(val) => setValue({ ...value, email: val })}
                    label="Email"
                    type="email"
                    autoComplete='email'
                    requiredIndicator
                    helpText={
                        <span></span>
                    }
                />

                <TextField
                    value={value.password}
                    onChange={(val) => setValue({ ...value, password: val })}
                    label="Password"
                    type="password"
                    autoComplete="password"
                    helpText={
                        <span></span>
                    }
                    requiredIndicator
                />

                <Button primary submit>Submit</Button>
            </FormLayout>
        </Form>
    );
}

