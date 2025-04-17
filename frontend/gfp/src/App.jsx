import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./pages/Principal";
import Login from "./pages/Login";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/principal" element={<Principal />} />
			</Routes>
		</Router>
	);
}
