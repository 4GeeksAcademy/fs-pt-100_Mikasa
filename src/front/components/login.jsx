import { useState } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import "../styles/User.css";
import { RecuperarPassword } from "./modals/recuperarPassword"

export const Login = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer();
  const [showRecovery, setShowRecovery] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token, user } = await userServices.login(formData);
      const hogar = await userServices.getHogar(user.hogar_id);
      dispatch({
        type: "login_success",
        payload: { token, user, hogar }
      });
      navigate("/hogar")
    } catch (error) {
      console.error("Error al acceder:", error);
    }

  };

  return (
    <div className="user-container">
      <form onSubmit={handleSubmit} className="user-form">
        <input
          placeholder="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
        />
        <input
          placeholder="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          required
        />
        <button type="submit" className="user-button w-100">Iniciar sesión</button>
      </form>

      <div className="mt-3 text-center">
        <span
          className="recovery-link"
          role="button"
          onClick={() => setShowRecovery(true)}
        >
          ¿Olvidaste tu contraseña?
        </span>
      </div>

      <p className="mt-4 mb-0 ivory">Nuevo Usuario?<br /><Link to="/register">Crear tu hogar</Link></p>

      <RecuperarPassword show={showRecovery} onClose={() => setShowRecovery(false)} />
    </div>
  );
};
