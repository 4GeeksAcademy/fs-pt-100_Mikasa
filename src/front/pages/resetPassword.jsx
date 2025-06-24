import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userServices from "../services/userServices";
import "../styles/User.css";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    repeat_password: ""
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const passwordsMatch =
    formData.repeat_password === "" ||
    formData.repeat_password === formData.password;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Token inválido o no proporcionado.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await userServices.updatePassword(token, formData.password);
      setMessage("Contraseña cambiada con éxito. Redirigiendo al login...");
      setError(null);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Error cambiando la contraseña.");
      setMessage(null);
    }
  };

  return (
    <div className="user-container">
      <h2 className="ivory">Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="password"
          name="password"
          placeholder="Nueva contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="repeat_password"
          placeholder="Repetir contraseña"
          value={formData.repeat_password}
          onChange={handleChange}
          className={formData.repeat_password && !passwordsMatch ? "is-invalid" : ""}
          required
        />
        {formData.repeat_password && !passwordsMatch && (
          <div className="invalid-feedback">Las contraseñas no coinciden.</div>
        )}

        <button type="submit" className="user-button w-100">Cambiar contraseña</button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {message && <div className="alert alert-success mt-3">{message}</div>}
    </div>
  );
};