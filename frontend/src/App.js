import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import MeetingCalender from './pages/MeetingCalender';

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				}
			/>
			<Route
				path="/meetings/:contractAddress"
				element={
					<PrivateRoute>
						<MeetingCalender />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default App;
