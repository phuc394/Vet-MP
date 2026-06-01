import "./Login.css";
import { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginAdmin, setEmail, setPassword } from "../../redux/slices/login.slice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email, password, error, isSubmitting } = useAppSelector((state) => state.login);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await dispatch(loginAdmin({ email, password })).unwrap();
            navigate("/home");
        } catch {
            // Error message is stored in Redux state.
        }
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Sign In</h1>

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => dispatch(setEmail(event.target.value))}
                    placeholder="admin@gmail.com"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => dispatch(setPassword(event.target.value))}
                    placeholder="Enter your password"
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button className="login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    );
};

export default Login;
