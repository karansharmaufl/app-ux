"use client";

import React, { useState } from 'react';
import { app } from "../../firebase";
import { getAuth, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { useRouter } from "next/navigation";

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const router = useRouter();

  const handleSendCode = () => {
    const recaptchaVerifier = new RecaptchaVerifier(getAuth(app), 'send-code-button', {
      size: 'invisible',
    });

    signInWithPhoneNumber(getAuth(app), phoneNumber, recaptchaVerifier)
      .then(async (verificationData) => {
        setVerificationId(verificationData.verificationId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVerifyCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);

    signInWithCredential(getAuth(app), credential)
      .then(async (result) => {
        // User signed in successfully
        await fetch("/api/login", {
          headers: {
            Authorization: `Bearer ${await result.user.getIdToken()}`,
          },
        });

        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login with Phone
          </h1>
          {!verificationId && <div>
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <br></br>
            <button id="send-code-button" className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800"
              onClick={handleSendCode}>Send Code</button>
          </div>}
          {verificationId && <div>
            <label htmlFor="verificationCode"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Verification Code
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)} />
            <br></br>
            <button className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800" onClick={handleVerifyCode}>Verify Code</button>
          </div>}
        </div>
      </div>
    </main>
  );
};

export default PhoneAuth;