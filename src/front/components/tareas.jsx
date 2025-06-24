import "../styles/Tareas.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/Tareas.css";
import { Card } from "./card";

export const Tareas = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const [showCardModal, setShowCardModal] = useState(false);
	const [editIndex, setEditIndex] = useState(null);

	const [filtro, setFiltro] = useState("todas");


	const openModal = () => {
		setEditIndex(null);
		setShowCardModal(true);

	};

	const handleDelete = (index) => {
		dispatch({ type: "delete_task", payload: index });
	};

	const handleEdit = (index) => {
		setEditIndex(index);
		setShowCardModal(true);
	};

	const filteredTasks = store.tasks?.filter((t) => {
		if (filtro === "hechas") return t.hecha;
		if (filtro === "pendientes") return !t.hecha;
		return true;
	});

	return (
		<>
			<div className="container-fluid w-75 rounded border-charcoal my-4 p-0">
				<div className="text-center w-100 rounded-top bg-coral m-0 p-0">
					<h3 className="text-center ivory text-outline py-3 m-0">Mis Tareas</h3>
				</div>

				<div className="tareas text-ivory px-3">

					<div className="d-flex justify-content-end mb-3">
						<div>
							<label className="me-2"><strong>Filtrar:</strong></label>
							<select
								className="form-select d-inline w-auto"
								value={filtro}
								onChange={(e) => setFiltro(e.target.value)}
							>
								<option value="todas">Todas</option>
								<option value="hechas">Hechas</option>
								<option value="pendientes">Pendientes</option>
							</select>
						</div>
					</div>

					<div className="text-center">
						<button className="add-task-button mt-1 mb-4" onClick={openModal}>
							Agregar Nueva Tarea
						</button>
					</div>

					<div className="container">
						<div className="row">
							{filteredTasks?.length === 0 ? (
								<p>No hay tareas que coincidan con el filtro.</p>
							) : (
								filteredTasks.map((t, i) => (
									<div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
										<div
											className={`card p-3 h-100 text-start bg-ivory 
											${t.hecha ? "hecha" : "pendiente"}`}

										>
											<h5 className={t.hecha ? "text-decoration-line-through" : ""}>{t.nombre}</h5>
											<div className="d-flex flex-wrap gap-2 mb-2">
												<p className="mb-0">
													<strong>Asignada a:</strong>{" "}
													{t.asignadaA === "equipo"
														? t.miembros?.join(", ") || "Sin miembros"
														: "Usuario"}
												</p>
												<p className="mb-0"><strong>Frecuencia:</strong> {t.frecuencia}</p>
												<p className="mb-0"><strong>Fecha:</strong> {t.fecha}</p>
											</div>
											<p className="mt-2"><strong>Descripción:</strong> {t.descripcion}</p>

											<div className="mt-auto text-end">
												<button
													className={`btn btn-sm ${t.hecha ? "btn-success" : "btn-outline-success"} me-2`}
													onClick={() => dispatch({ type: "toggle_task_done", payload: i })}
												>
													{t.hecha ? "Hecha" : "Marcar como hecha"}
												</button>

												<button
													className={`btn btn-sm ${t.hecha ? "btn-light text-success" : "btn-outline-warning"} me-2`}
													onClick={() => handleEdit(i)}
												>
													<span className="fa-regular fa-pen-to-square"></span>
												</button>

												<button
													className="btn btn-sm btn-outline-danger"
													onClick={() => handleDelete(i)}
												>
													<span className="fa-solid fa-trash"></span>
												</button>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
			{showCardModal && (
				<div
					className="modal fade show d-block"
					tabIndex="-1"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
					onClick={() => setShowCardModal(false)}
				>
					<div
						className="modal-dialog modal-lg modal-dialog-centered"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="modal-content bg-coral rounded border-charcoal p-3">
							<div className="modal-header border-0">
								    <h2 className="modal-title charcoal w-100 text-center m-0">
										{editIndex !== null
										? store.tasks[editIndex]?.nombre || "Editar Tarea"
										: "Nueva Tarea"}
									</h2>
								<button type="button" className="btn-close" onClick={() => setShowCardModal(false)}></button>
							</div>
							<div className="modal-body p-0">
								<Card
									task={editIndex !== null ? store.tasks[editIndex] : null}
									index={editIndex}
									onClose={() => setShowCardModal(false)}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

