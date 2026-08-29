/* =========================================================
   AGARWAL STORE
   CODE 11 — AUTHENTICATION FOUNDATION
   ========================================================= */

import {
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   FIREBASE AUTH
   ========================================================= */

const auth =
  window.AgarwalFirebase?.auth;


/* =========================================================
   AUTH CHECK
   ========================================================= */

function checkAuth() {

  if (!auth) {

    throw new Error(
      "Agarwal Store: Firebase Authentication is not ready."
    );

  }

}


/* =========================================================
   RECAPTCHA
   ========================================================= */

let recaptchaVerifier = null;


function createRecaptcha(
  containerId = "recaptcha-container"
) {

  checkAuth();


  if (recaptchaVerifier) {

    return recaptchaVerifier;

  }


  recaptchaVerifier =
    new RecaptchaVerifier(
      auth,
      containerId,
      {
        size: "invisible"
      }
    );


  return recaptchaVerifier;

}


/* =========================================================
   SEND PHONE OTP
   ========================================================= */

async function sendPhoneOTP(
  phoneNumber,
  containerId = "recaptcha-container"
) {

  checkAuth();


  if (!phoneNumber) {

    throw new Error(
      "Phone number is required."
    );

  }


  const verifier =
    createRecaptcha(
      containerId
    );


  const confirmationResult =
    await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier
    );


  window.AgarwalAuthState = {

    confirmationResult

  };


  return confirmationResult;

}


/* =========================================================
   VERIFY PHONE OTP
   ========================================================= */

async function verifyPhoneOTP(
  otp
) {

  if (
    !window.AgarwalAuthState ||
    !window.AgarwalAuthState.confirmationResult
  ) {

    throw new Error(
      "Please request an OTP first."
    );

  }


  if (!otp) {

    throw new Error(
      "OTP is required."
    );

  }


  const result =
    await window
      .AgarwalAuthState
      .confirmationResult
      .confirm(otp);


  window.AgarwalAuthState = {

    confirmationResult: null

  };


  return result.user;

}


/* =========================================================
   CURRENT USER
   ========================================================= */

function getCurrentUser() {

  checkAuth();

  return auth.currentUser;

}


/* =========================================================
   AUTH STATE LISTENER
   ========================================================= */

function watchAuthState(
  callback
) {

  checkAuth();


  return onAuthStateChanged(
    auth,
    callback
  );

}


/* =========================================================
   SIGN OUT
   ========================================================= */

async function logout() {

  checkAuth();

  await signOut(auth);

}


/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

async function changePassword(
  currentPassword,
  newPassword
) {

  checkAuth();


  const user =
    auth.currentUser;


  if (!user) {

    throw new Error(
      "No authenticated user found."
    );

  }


  if (
    !user.email
  ) {

    throw new Error(
      "Password change is available for email accounts."
    );

  }


  const credential =
    EmailAuthProvider.credential(
      user.email,
      currentPassword
    );


  await reauthenticateWithCredential(
    user,
    credential
  );


  await updatePassword(
    user,
    newPassword
  );


  return true;

}


/* =========================================================
   PUBLIC AUTH API
   ========================================================= */

window.AgarwalAuth = {

  createRecaptcha,

  sendPhoneOTP,

  verifyPhoneOTP,

  getCurrentUser,

  watchAuthState,

  logout,

  changePassword

};


/* =========================================================
   AUTH READY EVENT
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:auth-ready"
  )

);
