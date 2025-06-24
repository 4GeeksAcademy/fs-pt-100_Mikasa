import { useState, useEffect } from "react";
import userServices from "../../services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/User.css";
import EmailTagsInput from "../../components/EmailTagsInput";

export const Invitar = ({ show, onClose }) => {
  const { store, dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    otros: []
  });

  useEffect(() => {
    if (show) {
      setFormData({
        otros: []
      });
    }
  }, [show]);

  const handleEmailsChange = (newEmailsArray) => {
    setFormData({ ...formData, otros: newEmailsArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.otros.length === 0) {
      alert("Añade al menos un correo válido pulsando 'Enter' antes de enviar.");
      return;
    }

    const inviterName = store.user.user_name;
    const hogar_id = store.hogar.id;
    try {
      for (const email of formData.otros) {
        await userServices.sendInvitation({
          email,
          inviterName,
          hogar_id,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al enviar invitaciones:\n" + err.message);
    }
  };

  return (
    <>
      <div className={`modal fade ${show ? "show d-block" : ""}`} style={{ display: show ? "block" : "none" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content editprofile-container" style={{ border: "2px solid ivory" }}>
            <div className="modal-header border-0">
              <h3 className="modal-title ivory text-center w-100">Invitar a más gente</h3>
              <button type="button" onClick={onClose} className="btn btn-link p-0 m-0 border-0" aria-label="Close">
                <span className="fa-solid fa-xmark coral fs-4"></span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="row">
                <div className="col-4 d-flex justify-content-end">
                  <label className="ivory fw-bold pt-3">Invitar miembros</label>
                </div>
                <div className="col-8">
                  <EmailTagsInput
                    id="otros"
                    emails={formData.otros}
                    onChange={handleEmailsChange}
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <button type="submit" className="user-button col-4">Invitar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};
