import { useState, useEffect } from "react";
import userServices from "../../services/userServices";
import "../../styles/User.css";

export const RecuperarPassword = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setEmail("");
      setMessage(null);
      setError(null);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Por favor introduce un correo válido.");
      return;
    }
    try {
      const res = await userServices.sendRecuperacion(email);
      setMessage(res.msg || `Se ha enviado un enlace a ${email}`);
      setError(null);
    } catch (err) {
      setError(err.message || "Error enviando enlace de recuperación.");
      setMessage(null);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content editprofile-container modal-recuperar">
            <div className="modal-header border-0">
              <h3 className="modal-title ivory text-center w-100">Recuperar contraseña</h3>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Cerrar"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="row mb-3">
                <div className="col-12">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Introduce tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="user-button">Enviar</button>
              </div>

              {message && <div className="alert alert-success mt-3 text-center">{message}</div>}
              {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
