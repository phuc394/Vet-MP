import { useState } from "react";
import axios from "axios";

import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "") ||
  "http://localhost:3000";

function App() {

  const [isSuccess, setIsSuccess] =
  useState(false);
  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [message, setMessage] =
    useState("");

  const token =
    new URLSearchParams(
      window.location.search
    ).get("token");

  const handleResetPassword =
  async () => {
    if (!API_BASE_URL) {
      setMessage(
        "API base URL is not configured"
      );

      setIsSuccess(false);

      return;
    }

    if (!token) {
      setMessage(
        "Reset token is missing"
      );

      setIsSuccess(false);

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setMessage(
        "Passwords do not match"
      );

      setIsSuccess(false);

      return;
    }

    try {
      const response =
        await axios.post(
          `${API_BASE_URL}/api/v1/auth/reset-password`,
          {
            token,
            newPassword,
          }
        );

      setMessage(
        response.data.message
      );

      setIsSuccess(true);
    } catch (error: unknown) {
      setIsSuccess(false);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
          "Reset password failed"
        );
      } else {
        setMessage(
          "Unexpected error"
        );
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleResetPassword
          }
        >
          Reset Password
        </button>

        {message && (
  <p
    className={
      isSuccess
        ? "message success"
        : "message error"
    }
  >
    {message}
  </p>
)}

    {isSuccess && (
      <div className="return-box">
        <p>
          Your password has been
          changed successfully.
          <br />
          <br />
          You can now close this page
          and return to the PetClinic
          mobile application.
        </p>
      </div>
    )}
      </div>
    </div>
  );
}

export default App;
