import { useState, useEffect, useRef } from "react";
import userServices from "../services/userServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
import EmailTagsInput from "../components/EmailTagsInput";
import placeholder from "../assets/img/avatar-placeholder.jpg";
const CLOUD_NAME = "daavddex7";
const UPLOAD_PRESET = "avatar_unsigned";

export const Register = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    hogar_name: "",
    user_name: "",
    email: "",
    password: "",
    repeat_password: "",
    avatar_url: "",
    otros: []
  });

  const widgetRef = useRef(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          folder: "user_avatars",
          maxImageFileSize: 10000000,
          clientAllowedFormats: ["png", "jpg", "jpeg"],
          showAdvancedOptions: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#000000",
              menuIcons: "#555a5f",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0433ff",
              action: "#339933",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
            },
            fonts: {
              default: null,
              "'Fira Sans', sans-serif": {
                url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                active: true,
              },
            },
          },
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Widget error:", error);
            return;
          }
          if (result.event === "success") {
            console.log("Upload Successful:", result.info);
            setFormData((prev) => ({
              ...prev,
              avatar_url: result.info.secure_url,
            }));
          }
        }
      );
    }
  }, []);

  const handleChooseAvatar = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error("Widget not ready yet");
    }
  };

  const handleEmailsChange = (newEmailsArray) => {
    setFormData({ ...formData, otros: newEmailsArray });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await userServices.register(formData);
      navigate("/login")
      
      for (const email of formData.otros) {
        await userServices.sendInvitation(email, formData.user_name);
      } 

    } catch (err) {
      console.error(err);
      alert("Error creating hogar:\n" + err.message);
    }

  };

  const getTransformedAvatar = (url) => {
    if (!url) return '';
    return url.replace('/upload/', '/upload/c_thumb,g_face,w_100,h_100/');
  };

  const passwordsMatch =
    formData.repeat_password === "" ||
    formData.repeat_password === formData.password;

  return (
    <div className="register-container">
      <h2 className="ivory">Crear tu hogar</h2>
      <p className="ivory">Para unirte a un hogar ya creado, comprueba tu email para un enlace. Para crear un nuevo hogar, rellena el formulario.</p>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="hogar_name" className="ivory fw-bold">Nombre del hogar</label>
          </div>
          <div className="col-8">
            <input
              placeholder="Mikasa"
              id="hogar_name"
              name="hogar_name"
              value={formData.hogar_name}
              onChange={handleChange}
              type="text"
              className="my-1"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="user_name" className="ivory fw-bold">Nombre de usuario</label>
          </div>
          <div className="col-8">
            <input
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              type="text"
              className="my-1"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="email" className="ivory fw-bold">Correo electrónico</label>
          </div>
          <div className="col-8">
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="my-1"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="password" className="ivory fw-bold">Contraseña</label>
          </div>
          <div className="col-8">
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="my-1"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 d-flex align-items-center justify-content-end">
            <label htmlFor="repeat_password" className="ivory fw-bold">Repetir la contraseña</label>
          </div>
          <div className="col-8">
            <input
              id="repeat_password"
              name="repeat_password"
              value={formData.repeat_password}
              onChange={handleChange}
              type="password"
              className={`form-control my-1 ${formData.repeat_password && !passwordsMatch ? "is-invalid" : ""
                }`}
              required
            />

            <div className="invalid-feedback">
              Las contraseñas no coinciden.
            </div>
          </div>
        </div>
        <div className="row align-items-center my-2">
          <div className="col-4 d-flex justify-content-end">
            <label className="ivory fw-bold">
              Imagen de perfil
            </label>
          </div>
          <div className="col-3">
            <div>
              <img
                src={
                  formData.avatar_url
                    ? getTransformedAvatar(formData.avatar_url)
                    : placeholder
                }
                alt="Avatar Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <button
              type="button"
              id="upload-avatar-btn"
              onClick={handleChooseAvatar}
              className="user-button w-100"
            >
              Subir
            </button>
          </div>

        </div >
        <div className="row">
          <div className="col-4 d-flex justify-content-end">
            <label className="ivory fw-bold pt-3">
              Invitar miembros
            </label>
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
          <button type="submit" className="user-button col-8">Crear hogar</button>
        </div>
      </form>
      <p className="mt-4 mb-0 ivory">¿Ya tienes cuenta?<br /><Link to="/login">Acceder a tu hogar</Link></p>
    </div>
  );
};
