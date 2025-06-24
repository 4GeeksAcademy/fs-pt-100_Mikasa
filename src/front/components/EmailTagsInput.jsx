import { useState } from "react";

export default function EmailTagsInput({ emails, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const addEmail = () => {
    const candidate = inputValue.trim().replace(/,$/, "");
    if (!candidate) {
      setInputValue("");
      return;
    }
    if (!EMAIL_REGEX.test(candidate)) {
      setError("Formato de email inválido");
      return;
    }
    if (emails.includes(candidate)) {
      setError("Este correo ya está agregado");
      return;
    }
    onChange([...emails, candidate]);
    setInputValue("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (idx) => {
    const newArr = emails.filter((_, i) => i !== idx);
    onChange(newArr);
  };

  return (
    <div>
      <input
        type="text"
        className={`form-control my-1 ${error ? "is-invalid" : ""}`}
        placeholder="Escribe un correo y presiona Enter"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (error) setError("");
        }}
        onKeyDown={handleKeyDown}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      <div className="mt-0 mb-4 align-items-center">
        {emails.map((email, idx) => (
          <span
            key={idx}
            className="badge bg-coral fs-6 fw-normal m-1 d-inline-flex align-items-center rounded-pill"
          >
            {email}{" "}
            <button
              type="button"
              className="btn-close btn-close-white btn-sm"
              aria-label="Remove"
              onClick={() => removeEmail(idx)}
            />
          </span>
        ))}
      </div>

    </div>
  );
}
