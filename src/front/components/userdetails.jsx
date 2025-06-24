import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import placeholder from "../assets/img/avatar-placeholder.jpg";
import { EditAccount } from "./modals/editaccount";

export const UserDetails = () => {
  const { store } = useGlobalReducer();

  const avatarSrc = store.user?.avatar_url
    ? store.user.avatar_url
    : placeholder;

  const [showEditModal, setShowEditModal] = useState(false);

  const openEditAccountModal = () => setShowEditModal(true);
  const closeEditAccountModal = () => setShowEditModal(false);

  return (
    <div className="register-container">
      <h2 className="ivory mb-3">{store.user.user_name}
      </h2>
      <div className="row align-items-center my-2">
        <div className="col-6 d-flex justify-content-end">
          <p className="ivory fw-bold">
            Imagen de perfil
          </p>
        </div>
        <div className="col-6 d-flex justify-content-start">
          <div>
            <img src={avatarSrc} alt="Avatar Preview" className="avatar-big"/>
          </div>
        </div>
      </div >
      <div className="row d-flex align-items-center">
        <div className="col-6 d-flex justify-content-end">
          <p className="ivory fw-bold">Correo electrónico</p>
        </div>
        <div className="col-6 d-flex justify-content-start">
        <p className="ivory">{store.user.email}</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <button onClick={openEditAccountModal} className="user-button col-3">Editar</button>
      </div>
      {showEditModal && (
        <EditAccount
          show={showEditModal}
          onClose={closeEditAccountModal}
        />
      )}
    </div>
  );
};
