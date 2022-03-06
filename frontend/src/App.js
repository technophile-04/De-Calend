import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useState } from 'react';
import Calender from './components/Calender';

function App() {
	const [account, setAccount] = useState('');

	const handleClick = async () => {
		try {
			const provider = await detectEthereumProvider();

			const accounts = await provider.request({
				method: 'eth_requestAccounts',
			});

			if (accounts.length > 0) {
				setAccount(accounts[0]);
				console.log('account found', accounts);
			} else {
				console.log('No account found');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const isConnected = async () => {
		const provider = await detectEthereumProvider();
		if (provider) {
			const accounts = await provider.request({ method: 'eth_accounts' });
			if (accounts.length > 0) {
				setAccount(accounts[0]);
			} else {
				console.log('NO authorized account found');
			}
		} else {
			console.log('Please install Metamask');
		}
	};

	useEffect(() => {
		isConnected();
	}, []);

	return (
		<div>
			<h1 className="text-4xl font-bold">DeCalend</h1>
			<p className="text-2xl">Web 3 appointment scheduler</p>
			{!account && (
				<button
					onClick={handleClick}
					className="h-10 px-6 font-semibold rounded-md bg-black text-white"
				>
					Connect Wallet
				</button>
			)}
			{account && <Calender />}
		</div>
	);
}

export default App;
