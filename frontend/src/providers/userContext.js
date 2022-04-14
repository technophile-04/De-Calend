import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

const { ethereum } = window;

export const UserProvider = ({ children }) => {
	const [account, setAccount] = useState('');

	const isConnected = async () => {
		if (ethereum) {
			// const provider = new ethers.providers.Web3Provider(ethereum);
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			if (accounts.length > 0) {
				setAccount(accounts[0]);
			} else {
				setAccount('');

				console.log('NO authorized account found');
			}
		} else {
			console.log('Please install Metamask');
		}
	};

	useEffect(() => {
		ethereum.on('disconnect', (ProviderRpcError) => {
			console.log(ProviderRpcError);
			window.location.reload();
		});

		ethereum.on('accountsChanged', (accounts) => {
			if (accounts.length > 0) {
				console.log('Change accoounts', accounts);
				setAccount(accounts[0]);
			} else {
				setAccount('');
				console.log('NO authorized account found');
			}
		});

		isConnected();
	}, []);

	return (
		<UserContext.Provider value={{ account, setAccount }}>
			{children}
		</UserContext.Provider>
	);
};
