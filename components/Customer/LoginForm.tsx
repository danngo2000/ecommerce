import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, FC } from "react";
import { connect } from "react-redux";
import { signInWithGoogle } from "../../utils/firebase/utils";
import { loginRequest } from "../../store/reducers/auth";
import { AuthActions } from "../../store/reducers/authV1";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState({ emailError: "", passwordError: "" });
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleChangeInput = (event: any) => {
    const { name, value } = event.target;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };

  const checkValidate = () => {
    if (!formLogin.email) {
      setError({ ...error, emailError: "Please enter your email" });
      if (!formLogin.password) {
        setError({
          ...error,
          passwordError: "Please enter your password",
        });
      }
      return false;
    } else if (!formLogin.password) {
      setError({
        ...error,
        emailError: "",
        passwordError: "Please enter your password",
      });
      return false;
    } else {
      setError({
        ...error,
        emailError: "",
        passwordError: "",
      });
      return true;
    }
  };

  const handleLogin = (event: any) => {
    setIsloading(false);
    if (checkValidate()) {
      dispatch(
        AuthActions.LOGIN_REQUEST({
          req: {
            ...formLogin,
            type: "default",
          },
          cb: (res) => {
            if (res && res.isLogin) router.push("/");
          },
        })
      );
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="register-form account-form container">
      <h1>Login to VNT Signature</h1>
      <div className="form-wrap">
        <form onSubmit={handleSubmit}>
          <div className="field form-group field-email">
            <label id="emailLabel">Email</label>
            <input
              onChange={handleChangeInput}
              value={formLogin.email}
              required
              minLength={5}
              className="required-entry input-text form-control"
              type="email"
              name="email"
              placeholder="your@email.com"
            />
            <div className="error" id="emailError">
              {error.emailError}
            </div>
          </div>
          <div className="field form-group field-password">
            <label id="passwordLabel">Password</label>
            <input
              value={formLogin.password}
              onChange={handleChangeInput}
              className="required-entry input-text form-control"
              type="password"
              name="password"
              pattern=".{5,}"
              placeholder="Your Password"
              required
            />
            <div className="error" id="passwordError">
              {error.passwordError}
            </div>
          </div>
          <div className="field form-group fieldButton">
            <div className="field fieldButton">
              <button onClick={handleLogin} type="submit" className="btn">
                login
              </button>
            </div>
            <div className="field fieldButton">
              <button onClick={signInWithGoogle} type="button" className="btn">
                Login with Google
              </button>
            </div>
            <Link href="/customer/forgotPassword">
              <a>Forgot Your Password?</a>
            </Link>
          </div>
        </form>
        <div className="link-actions">
          Don't have an account?&nbsp;
          <Link href="/customer/register">
            <a>Sign up</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapState = () => ({});

const mapDispatch = () => ({});

export default connect(mapState, mapDispatch)(LoginForm);
