const userServices = {};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

userServices.register = async (formData) => {
  try {
    const resp = await fetch(backendUrl + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => null);
      throw new Error(text || resp.statusText);
    }

    const data = await resp.json();
    localStorage.setItem("token", data.token);

    if (data.user?.hogar_id) {
      localStorage.setItem("hogar_id", data.user.hogar_id);
    }

    return data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

userServices.join = async (formData) => {
  try {
    const resp = await fetch(backendUrl + "/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");

    const data = await resp.json();
    localStorage.setItem("token", data.token);

    if (data.user?.hogar_id) {
      localStorage.setItem("hogar_id", data.user.hogar_id);
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error("Join failed:", error);
    throw error;
  }
};

userServices.updateuser = async (userId, formData) => {
  try {
    const token = localStorage.getItem("token");
    console.log(`PUT /api/users/${userId}  token:`, token);
    const resp = await fetch(`${backendUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (resp.status === 401) {
      const err = await resp.json().catch(() => null);
      console.error("Unauthorized:", err);
      throw new Error(err?.msg || err?.error || "Unauthorized");
    }
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Deletion error:", error);
    throw error;
  }
};

userServices.deleteuser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${backendUrl}/api/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || resp.statusText);
    }
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

userServices.updatehogar = async (hogarId, formData) => {
  try {
    const resp = await fetch(`${backendUrl}/api/hogares/${hogarId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Update error:", error);
    throw error;
  }
};

userServices.login = async (formData) => {
  try {
    const resp = await fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await resp.json();

    if (!resp.ok) throw Error(data.error || "Something went wrong");

    localStorage.setItem("token", data.token);

    if (data.user?.hogar_id) {
      localStorage.setItem("hogar_id", data.user.hogar_id);
    } else {
      console.warn("No se encontró hogar_id en el usuario");
    }

    return data;
  } catch (error) {
    console.log("Login error:", error.message);
    throw error;
  }
};

userServices.getUserInfo = async () => {
  try {
    const resp = await fetch(backendUrl + "/api/private", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resp.ok) throw Error("something went wrong");
    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

userServices.getUser = async (userId) => {
  try {
    const resp = await fetch(`${backendUrl}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resp.ok) throw Error("Could not fetch user");
    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

userServices.getHogar = async (hogarId) => {
  try {
    const resp = await fetch(`${backendUrl}/api/hogares/${hogarId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (!resp.ok) throw Error("Could not fetch hogar");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
userServices.sendInvitation = async (invitationdata) => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${backendUrl}/api/send_invitation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invitationdata),
    });

    const responseData = await resp.json();

    if (!resp.ok) {
      throw new Error(responseData.msg || "Error sending invitation");
    }

    return responseData;
  } catch (error) {
    console.error("sendInvitation error:", error);
    throw error;
  }
};

userServices.sendRecuperacion = async (email) => {
  try {
    const resp = await fetch(`${backendUrl}/api/check_mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.msg || "Error enviando correo de recuperación");
    }

    return data;
  } catch (error) {
    console.error("sendrecuperacion error:", error);
    throw error;
  }
};

userServices.updatePassword = async (token, password) => {
  try {
    const resp = await fetch(`${backendUrl}/api/password_update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
    if (resp.status !== 200) throw new Error("Error actualizando la contraseña");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("updatePassword error:", error);
    throw error;
  }
};


export default userServices;
