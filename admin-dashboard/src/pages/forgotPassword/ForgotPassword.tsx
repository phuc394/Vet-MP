import "../login/Login.css";
import "./ForgotPassword.css";
import "../../styles/global.css";
import { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { forgotPasswordAdmin, setForgotPasswordEmail } from "../../redux/slices/forgotPassword.slice";

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const { email, error, message, isSubmitting } = useAppSelector((state) => state.forgotPassword);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await dispatch(forgotPasswordAdmin({ email })).unwrap();
        } catch {
            // Error message is stored in Redux state.
        }
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <p className="login-description">
                    Enter your admin email and we will send a password reset link to your Gmail.
                </p>

                <label htmlFor="forgot-email">Email</label>
                <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => dispatch(setForgotPasswordEmail(event.target.value))}
                    placeholder="admin@gmail.com"
                    required
                />

                {error && <p className="login-error">{error}</p>}
                {message && <p className="login-success">{message}</p>}

                <button className="login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Gmail"}
                </button>

                <Link className="login-link" to="/">
                    Back to Sign In
                </Link>
            </form>
        </div>
    );
};

export default ForgotPassword;
