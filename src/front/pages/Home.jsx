import { useNavigate } from "react-router-dom";
import mikasaImage from "../assets/img/mikasa_charcoal.png";
import "../styles/Home.css";
import { Login } from "../components/login";
import { useEffect } from "react";

export const Home = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/hogar");
		}
	}, [navigate]);

	return (
		<>
			<div className="home-container">
				<div className="home-left">
					<Login />
				</div>
				<div className="home-right">
					<img src={mikasaImage} alt="Logo Mi Casa" className="home-logo" />
					<img
						src="https://imgs.search.brave.com/6P7FROFg7o4SOtJgCqhS3S2ScTckvwZCaoF1W4lmNrY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM0/OTM5MDUxNS9lcy9m/b3RvL2lkZWEtZGUt/bHVnYXItZGUtdHJh/YmFqby1zaW4tcGFw/ZWwtZmlybWEtZWxl/Y3RyJUMzJUIzbmlj/YS1maXJtYS1lbGVj/dHIlQzMlQjNuaWNh/LWdlc3RpJUMzJUIz/bi1kb2N1bWVudGFs/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1wb2MtUS02SmNk/YTdzX3FlUzhQbTBy/RU9yU3lFSWdfcTNC/WldjcGYwU21rPQ"
						alt="Decoración"
						className="home-banner"
					/>
				</div>
			</div>
			<p className="parrafo">
				Organiza tareas, controla tus gastos, guarda tus series favoritas y
				planifica tus comidas — todo en un solo lugar y fácil de compartir.
			</p>
		</>
	);
};
