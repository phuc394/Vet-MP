import "./Login.css";
import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../utils/axios";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await AuthService.login({ identifier: email, password });
            const token = response.data?.data?.accessToken ?? response.data?.accessToken ?? response.data?.token;

            if (token) {
                localStorage.setItem("accessToken", token);
            }

            localStorage.setItem("adminEmail", email);
            navigate("/home");
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? (error.request ? "Cannot reach the API. Please check API Gateway/CORS." : undefined)
                : undefined;

            setError(message ?? "Email hoặc mật khẩu không đúng.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Đăng nhập</h1>

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    required
                />

                <label htmlFor="password">Mật khẩu</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button className="login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
};

export default Login;
