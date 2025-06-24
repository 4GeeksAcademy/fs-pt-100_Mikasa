import { useState, useEffect } from "react";
import userServices from "../../services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/User.css";

export const EditHogar = ({ show, onClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        hogar_name: []
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (show) {
            setFormData({
                hogar_name: store.hogar.hogar_name || "",
            });
        }
    }, [show]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const updated = await userServices.updatehogar(store.hogar.id, formData);
            dispatch({ type: "update_hogar", payload: updated });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error updating hogar:\n" + err.message);
        }

    };

    return (
        <>
            <div
                className={`modal fade ${show ? "show d-block" : ""}`}
                style={{ display: show ? "block" : "none" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className="modal-content editprofile-container"
                        style={{ border: "2px solid ivory" }}
                    >
                        <div className="modal-header border-0">
                            <h3 className="modal-title ivory text-center w-100">Editar el hogar</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-link p-0 m-0 border-0"
                                aria-label="Close"
                            >
                                <span className="fa-solid fa-xmark coral fs-4"></span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="row">
                                <div className="col-4 d-flex align-items-center justify-content-end">
                                    <span className="ivory fs-5">Nombre</span>
                                </div>
                                <div className="col-8">
                                    <input
                                        placeholder="Mikasa"
                                        id="hogar_name"
                                        name="hogar_name"
                                        value={formData.hogar_name}
                                        onChange={handleChange}
                                        type="text"
                                        className="my-1 w-75"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center mt-3">
                                <button type="submit" className="user-button col-4">Editar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};
