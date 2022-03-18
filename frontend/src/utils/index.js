import { ethers } from 'ethers';
import contractAddress from '../contracts/contract-address.json';
import contract from '../contracts/DeCalend.json';

export const getContractReadOnly = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const deCalendContract = new ethers.Contract(
		contractAddress.contractAddress,
		contract.abi,
		provider
	);
	return deCalendContract;
};

export const getContractWrite = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const deCalendContract = new ethers.Contract(
		contractAddress.contractAddress,
		contract.abi,
		signer
	);
	return deCalendContract;
};
