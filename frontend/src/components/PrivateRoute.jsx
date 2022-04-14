import React, { useContext } from 'react';
import { UserContext } from '../providers/userContext';
import Login from '../pages/Login';

const PrivateRoute = ({ children }) => {
	const { account } = useContext(UserContext);

	return account ? children : <Login />;
};

export default PrivateRoute;
