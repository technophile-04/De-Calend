import React, { useContext } from 'react';
import { UserContext } from '../providers/userContext';

const { ethereum } = window;

const Login = () => {
	const { setAccount } = useContext(UserContext);

	const handleClick = async () => {
		try {
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});

			if (accounts.length > 0) {
				setAccount(accounts[0]);
				console.log('account found', accounts);
			} else {
				console.log('No account found');
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div>
			<h1 className="text-4xl font-bold">DeCalend</h1>
			<p className="text-2xl">Web 3 appointment scheduler</p>
			<button
				onClick={handleClick}
				className="h-10 px-6 font-semibold rounded-md bg-black text-white"
			>
				Connect Wallet
			</button>
		</div>
	);
};

export default Login;
