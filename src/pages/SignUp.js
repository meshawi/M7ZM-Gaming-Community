import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Checkbox,
  Tooltip,
  Input,
} from '@nextui-org/react';
import { EyeFilledIcon } from '../components/icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../components/icons/EyeSlashFilledIcon';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const handleAgreeChange = () => setIsAgreed(!isAgreed);

  const validateInputs = () => {
    const fullNameRegex = /^[a-zA-Z\u0621-\u064A\u0660-\u0669\s'-]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    let isValid = true;

    if (!fullNameRegex.test(fullName)) {
      setFullNameError(t('full_name_error'));
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (!usernameRegex.test(username)) {
      setUsernameError(t('username_error'));
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(t('password_error'));
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    try {
      const response = await fetch('https://api.aleshawi.me/api/m7zm-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, full_name: fullName }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSuccessMessage(t('registration_success'));
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(t('registration_failed'));
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage(t('registration_error'));
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="max-w-sm w-full mx-4 shadow-lg">
        <CardHeader className="flex flex-col items-center pb-0 pt-4 px-4">
          <Image
            alt={t('app_logo')}
            height={50}
            radius="sm"
            src="/images/logo.png"
            width={50}
          />
          <h2 className="text-2xl font-bold mt-2">{t('create_account')}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="py-6">
          <Input
            isClearable
            isRequired
            label={t('full_name')}
            variant="bordered"
            placeholder={t('enter_full_name')}
            className="mb-4"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {fullNameError && <p className="text-danger">{fullNameError}</p>}
          <Input
            isClearable
            isRequired
            label={t('username')}
            variant="bordered"
            placeholder={t('enter_username')}
            className="mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p className="text-danger">{usernameError}</p>}
          <Input
            label={t('password')}
            isRequired
            variant="bordered"
            placeholder={t('enter_password')}
            endContent={
              <button className="focus:outline-none" type="button" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isPasswordVisible ? 'text' : 'password'}
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-danger">{passwordError}</p>}
          {errorMessage && (
            <p className="text-danger mb-4">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-success mb-4">
              {successMessage}
            </p>
          )}
          <div className="flex flex-col mb-4 space-y-2">
            <Checkbox checked={isAgreed} onChange={handleAgreeChange} color="primary">
              <Link href="/TermsAndConditions.pdf" color="primary" target="_blank" rel="noopener noreferrer">
                {t('agree_terms')}
              </Link>
            </Checkbox>
          </div>
          <Tooltip color="primary" content={t('click_to_sign_up')}>
            <Button
              color="primary"
              className="w-full font-bold py-2 px-4 rounded"
              isDisabled={!isAgreed}
              onClick={handleSignUp}
            >
              {t('sign_up')}
            </Button>
          </Tooltip>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-center py-4">
          <p>
            {t('have_account')} <Link href="/login" color="primary">{t('login')}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
