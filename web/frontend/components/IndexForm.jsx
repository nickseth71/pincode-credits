import { Form, TextContainer, FormLayout, Toast, TextField, Button, Frame } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import HttpRequest from '../utility/HttpRequest';
import { useAuthenticatedFetch, useNavigate } from '@shopify/app-bridge-react';

export function IndexForm() {
    const emptyToastProps = { content: null };
    const [toastProps, setToastProps] = useState(emptyToastProps);
    const [value, setValue] = useState({
        email: '',
        name: '',
        password: '',
    })
    const navigate = useNavigate();

    const [check, setCheck] = useState(false);


    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
    );

    const fetch = useAuthenticatedFetch();

    const handleSubmit = async () => {
        let lastAtPos = value.email.lastIndexOf('@');
        let lastDotPos = value.email.lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && value.email.indexOf('@@') == -1 && lastDotPos > 2 && (value.email.length - lastDotPos) > 2)) {
            setToastProps({ content: 'Please, Enter your valid Email!', error: true });
            return
        } else if (value.password == '') {
            setToastProps({ content: 'Please, Enter your password!', error: true });
            return;
        } else {
            setCheck(prevCheck => !prevCheck)
            const formData = new FormData();
            formData.append("email", value.email);
            var merchant_profile_by_email = await HttpRequest('https://pincodecredits.com/PincodeAdmin/API/V1/merchant_profile_by_email', 'POST', formData)
            var ress = merchant_profile_by_email[0];
            console.log('merchant_profile_by_email>>>', merchant_profile_by_email);
            if (ress.res !== "success") {
                setToastProps({ content: 'Email is incorrect! 😔', error: true });
                sessionStorage.setItem("isMerchantLoggedIn", false);
                sessionStorage.setItem("merchantBrandId", '');
                setCheck(prevCheck => !prevCheck)
                return;
            } else {
                if (value.password != ress.data[0].password) {
                    setToastProps({ content: 'Password is incorrect! 😔', error: true });
                    sessionStorage.setItem("isMerchantLoggedIn", false);
                    sessionStorage.setItem("merchantBrandId", '');
                    setCheck(prevCheck => !prevCheck)
                    return;
                }
                if (ress.res === "success") {
                    sessionStorage.setItem("isMerchantLoggedIn", true);
                    sessionStorage.setItem("merchantBrandId", ress.data[0].id);
                    setToastProps({ content: 'Login Successfully! 🎉' });
                    fetch(`/api/upadateUserId?marchantId=${ress.data[0].id}`).then(res => res.text()).then(data => {
                        console.log("cdjh--->", data);
                        navigate('/DashBoardPage');
                    })
                }
            }

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

                <TextContainer>Email us at connect@pincodecredits.com to get the login credentials.</TextContainer>

                <Button primary submit loading={check}>Submit</Button>
            </FormLayout>
        </Form>
    );
}

