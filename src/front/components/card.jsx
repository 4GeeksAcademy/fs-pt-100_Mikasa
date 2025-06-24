import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Tareas.css";


export const Card = ({ task, index, onClose }) => {
	const [nombre, setNombre] = useState(task?.nombre || "");
	const { dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		nombre: "",
		asignadaA: "",
		frecuencia: "",
		descripcion: "",
		fecha: "",
		hecha: false,
		miembros: [],
	});

	const miembrosList = ["juan", "ana", "maria", "lucia", "pedro", "thomas"];

	useEffect(() => {

	if (task) {
		setFormData(task);
	}
	}, [task]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === "miembros") {
			if (checked) {
				setFormData({
					...formData,
					miembros: [...formData.miembros, value],
				});
			} else {
				setFormData({
					...formData,
					miembros: formData.miembros.filter((m) => m !== value),
				});
			}
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const tarea = {
			...formData,
			hecha: formData.hecha || false,
		};


		if (task && typeof index === "number") {
			dispatch({
				type: "edit_task",
				payload: { index, updatedTask: tarea },
			});
		} else {
			dispatch({ type: "add_task", payload: tarea });
		}


		onClose();
	};

	return (
		<div className="tareas text-center text-ivory">
			<form
				onSubmit={handleSubmit}
				className="bg-light p-4 rounded text-dark mx-auto"
				style={{ maxWidth: "500px" }}
			>
				<div className="mb-3 text-start">
					<label htmlFor="nombre" className="form-label">Nombre:</label>
					<input
						type="text"
						className="form-control"
						id="nombre"
						name="nombre"
						value={formData.nombre}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 text-start">
					<strong>Asignada a:</strong>
					<div className="d-flex gap-3 align-items-center flex-wrap">
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="asignadaA"
								value="usuario"
								checked={formData.asignadaA === "usuario"}
								onChange={handleChange}
								id="radioUser"
							/>
							<label className="form-check-label" htmlFor="radioUser">
								<i className="fa-solid fa-user"></i>
							</label>
						</div>
						<div className="form-check form-check-inline align-items-start">
							<input
								className="form-check-input"
								type="radio"
								name="asignadaA"
								value="equipo"
								checked={formData.asignadaA === "equipo"}
								onChange={handleChange}
								id="radioTeam"
							/>
							<label
								className="form-check-label d-flex flex-column gap-2"
								htmlFor="radioTeam"
							>
								<i className="fa-solid fa-users"></i>
								{formData.asignadaA === "equipo" &&
									miembrosList.map((miembro) => (
										<div className="form-check" key={miembro}>
											<input
												className="form-check-input"
												type="checkbox"
												id={`check-${miembro}`}
												name="miembros"
												value={miembro}
												checked={formData.miembros.includes(miembro)}
												onChange={handleChange}
											/>
											<label
												className="form-check-label"
												htmlFor={`check-${miembro}`}
											>
												{miembro}
											</label>
										</div>
									))}
							</label>
						</div>
					</div>
				</div>

				<div className="mb-3 text-start">
					<label htmlFor="descripcion" className="form-label">Descripción:</label>
					<textarea
						className="form-control"
						id="descripcion"
						name="descripcion"
						rows="3"
						value={formData.descripcion}
						onChange={handleChange}
					></textarea>
				</div>

				<div className="mb-3 text-start">
					<strong>Frecuencia:</strong>
					<div className="d-flex gap-4 flex-wrap">
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frecuencia"
								id="unica"
								value="Única"
								checked={formData.frecuencia === "Única"}
								onChange={handleChange}
							/>
							<label className="form-check-label" htmlFor="unica">Única</label>
						</div>
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frecuencia"
								id="mensual"
								value="Mensual"
								checked={formData.frecuencia === "Mensual"}
								onChange={handleChange}
							/>
							<label className="form-check-label" htmlFor="mensual">Mensual</label>
						</div>
					</div>
				</div>

				<div className="mb-3 text-start">
					<label htmlFor="fecha" className="form-label">Fecha límite:</label>
					<input
						type="date"
						className="form-control"
						id="fecha"
						name="fecha"
						value={formData.fecha}
						onChange={handleChange}
					/>
				</div>

				<div className="text-end">
					<button type="submit" className="btn btn-primary me-2">Guardar</button>

					<button type="reset" className="btn btn-secondary" onClick={onClose}>Cancelar</button>

				</div>
			</form>
		</div>
	);
};
