import useGlobalReducer from "../hooks/useGlobalReducer";
import placeholder from "../assets/img/avatar-placeholder.jpg";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store } = useGlobalReducer();

	const avatarSrc = store?.user?.avatar_url
		? store.user.avatar_url
		: placeholder;

	return (
		<nav className="navbar navbar-expand-md bg-charcoal px-3">
			<div className="container-fluid">
				<div className="d-flex w-100 align-items-center justify-content-between">
					<Link to={store.token ? "/hogar" : "/login"} className="navbar-brand d-flex align-items-center">
						<img
							src="/src/front/assets/img/mikasa_ivory_sm.png"
							className="logo"
							alt="Mikasa logo"
						/>
					</Link>

					<button
						className="navbar-toggler border-0 ivory"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNavAltMarkup"
						aria-controls="navbarNavAltMarkup"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="fa fa-bars fa-2x ivory"></span>
					</button>
				</div>

				<div
					className="collapse navbar-collapse flex-column flex-md-row align-items-start align-items-md-center mt-2 mt-md-0"
					id="navbarNavAltMarkup"
				>
					<div className="d-flex d-md-none w-100 justify-content-end my-2">
						<Link to={store.token ? "/profile" : "/login"}>
							<img
								src={avatarSrc}
								alt="User avatar"
								className="rounded-circle user-avatar"
							/>
						</Link>
					</div>

					<div className="navbar-nav navbar-dark d-flex flex-column flex-md-row ms-md-auto px-md-5 gap-3 gap-md-4 w-100 align-items-end align-items-md-center justify-content-md-end justify-content-lg-center">
						<Link className="nav-link coral" to={store.token ? "/tareas" : "/login"}>
							Tareas
						</Link>
						<Link className="nav-link ochre" to={store.token ? "/finanzas" : "/login"}>
							Finanzas
						</Link>
						<Link className="nav-link aqua" to={store.token ? "/ocio" : "/login"}>
							Ocio
						</Link>
						<Link className="nav-link sage" to={store.token ? "/comida" : "/login"}>
							Comida
						</Link>
					</div>

					<div className="d-none d-md-flex align-items-center ms-md-3">
						{store.token ? (
							<Link to="/profile">
								<img
									src={avatarSrc}
									alt="User avatar"
									className="rounded-circle user-avatar"
								/>
							</Link>
						) : (
							<Link to="/login" className="text-white text-decoration-none fw-bold">
								Login
							</Link>
						)}
					</div>

				</div>
			</div>
		</nav>
	);
};
