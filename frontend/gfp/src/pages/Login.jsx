import { useNavigate, Link } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();

	return ( 
		<div>
			<h1>Tela de Login</h1> 
			<button onClick={() => navigate("/principal")}>Entrar</button>
		</div>
	);
}