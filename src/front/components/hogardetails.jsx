import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../assets/img/avatar-placeholder.jpg";
import { Invitar } from "./modals/invitar";
import { EditHogar } from "./modals/edithogar";
import { EditMember } from "./modals/editmember";

export const HogarDetails = () => {
  const navigate = useNavigate()
  const { store } = useGlobalReducer();
  const users = store.hogar.users

  const [showInvitarModal, setInvitarModal] = useState(false);
  const openInvitarModal = () => setInvitarModal(true);
  const closeInvitarModal = () => setInvitarModal(false);

  const [showEditHogarModal, setEditHogarModal] = useState(false);
  const openEditHogarModal = () => setEditHogarModal(true);
  const closeEditHogarModal = () => setEditHogarModal(false);

  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const openEditMemberModal = (id) => {
    setSelectedMemberId(id);
    setShowEditMemberModal(true);
  };
  const closeEditMemberModal = () => {
    setShowEditMemberModal(false);
    setSelectedMemberId(null);
  };

  return (
    <div className="register-container">
      <h2 className="ivory mb-3">{store.hogar.hogar_name}
        {store.user.admin === true && (
          <>
            <span onClick={openEditHogarModal} className="fa-solid fa-pencil user-icon ms-2"></span>
            {showEditHogarModal && (
              <EditHogar
                show={showEditHogarModal}
                onClose={closeEditHogarModal}
              />
            )}
          </>
        )}
      </h2>

      <div className="row">
        <div className="table-responsive">
          <table className="table table-striped align-middle users-table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"><span className="charcoal">Username</span></th>
                <th scope="col"><span className="charcoal">Email</span></th>
                <th scope="col"><span className="charcoal">Role</span></th>
                {store.user.admin === true && <th scope="col"></th>}
              </tr>
            </thead>
            <tbody>
              {users?.map(user => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.avatar_url ? user.avatar_url : placeholder}
                      alt={`${user.user_name} avatar`}
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{user.user_name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.admin
                      ? <span className="badge rounded-pill bg-success">admin</span>
                      : <span className="badge rounded-pill bg-secondary">miembro</span>
                    }
                  </td>
                  {store.user.admin && (
                    <td>
                      {user.id !== store.user.id && (
                        <>
                          <span
                            onClick={() => openEditMemberModal(user.id)}
                            className="fa-solid fa-pencil user-icon"
                          />
                          {showEditMemberModal && selectedMemberId === user.id && (
                            <EditMember
                              show={showEditMemberModal}
                              memberId={selectedMemberId}
                              onClose={closeEditMemberModal}
                            />
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {store.user.admin === true && (
        <>
          <div className="row justify-content-center">
            <button type="submit" onClick={openInvitarModal} className="user-button col-5">Invitar a más personas</button>
          </div>
          {showInvitarModal && (
            <Invitar
              show={showInvitarModal}
              onClose={closeInvitarModal}
            />
          )}
        </>
      )}

    </div>
  );
};
