import {
	ViewState,
	EditingState,
	IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
	Scheduler,
	WeekView,
	Appointments,
	AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getContractReadOnly, getContractWrite } from '../utils';
import Admin from './Admin';
import { ethers } from 'ethers';
import contract from '../contracts/DeCalend.json';

const Calender = ({ account }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [rate, setRate] = useState(0);
	const [showAdmin, setShowAdmin] = useState(false);
	const [appointments, setAppointments] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [showSign, setShowSign] = useState(false);
	const [mined, setMined] = useState(false);
	const [newContractAddress, setNewContractAddress] = useState('');
	const [transactionHash, setTransactionHash] = useState('');

	const formatAppointments = (appointmentData) => {
		let data = [];
		appointmentData.forEach((appointment) => {
			data.push({
				title: appointment.title,
				startDate: new Date(appointment.startTime * 1000),
				endDate: new Date(appointment.endTime * 1000),
			});
		});
		setAppointments(data);
	};

	const saveAppointment = async (data) => {
		const deCalendContract = getContractWrite();
		const appointment = data.added;
		const title = appointment.title;
		const startTime = appointment.startDate.getTime() / 1000;
		const endTime = appointment.endDate.getTime() / 1000;

		setShowSign(true);
		setShowDialog(true);
		setMined(false);

		try {
			const cost = ((endTime - startTime) / 60) * ((rate * 100) / 100);
			const msg = { value: ethers.utils.parseEther(cost.toString()) };
			let transaction = await deCalendContract.createAppointment(
				title,
				startTime,
				endTime,
				msg
			);
			setShowSign(false);

			await transaction.wait();

			setMined(true);
			setTransactionHash(transaction.hash);
		} catch (error) {
			console.log(error);
		}
	};

	const getData = async () => {
		const deCalendContract = getContractReadOnly();
		const owner = await deCalendContract.owner();
		console.log('Owner is ', owner);
		console.log('account', account);
		if (owner.toString().toLowerCase() === account.toString().toLowerCase()) {
			setIsAdmin(true);
		}

		const currentRate = await deCalendContract.getRate();
		setRate(ethers.utils.formatEther(currentRate));

		const data = await deCalendContract.getAppointments();
		console.log('Appointments', data);
		formatAppointments(data);
	};

	const deployNewContract = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);

		const factory = new ethers.ContractFactory(
			contract.abi,
			contract.bytecode,
			provider.getSigner()
		);

		const deployedContract = await factory.deploy();

		await deployedContract.deployTransaction.wait();

		console.log('new contract address is : ', deployedContract.address);
		setNewContractAddress(deployedContract.address);
	};

	useEffect(() => {
		getData();
	}, []);

	const ConfirmDialog = () => {
		return (
			<Dialog open={true}>
				<h3>
					{mined && 'Appointment Confirmed'}
					{!mined && !showSign && 'Confirming Your Appointment...'}
					{!mined && showSign && 'Please Sign to Confirm'}
				</h3>
				<div style={{ textAlign: 'left', padding: '0px 20px 20px 20px' }}>
					{mined && (
						<div>
							Your appointment has been confirmed and is on the blockchain.
							<br />
							<br />
							<a
								target="_blank"
								href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}
							>
								View on Etherscan
							</a>
						</div>
					)}
					{!mined && !showSign && (
						<div>
							<p>
								Please wait while we confirm your appoinment on the
								blockchain....
							</p>
						</div>
					)}
					{!mined && showSign && (
						<div>
							<p>Please sign the transaction to confirm your appointment.</p>
						</div>
					)}
				</div>
				<div style={{ textAlign: 'center', paddingBottom: '30px' }}>
					{!mined && <CircularProgress />}
				</div>
				{mined && (
					<Button
						onClick={() => {
							setShowDialog(false);
							getData();
						}}
					>
						Close
					</Button>
				)}
			</Dialog>
		);
	};

	return (
		<>
			{isAdmin && (
				<Button
					onClick={() => setShowAdmin(!showAdmin)}
					variant="contained"
					startIcon={<SettingsSuggestIcon />}
					style={{ marginTop: '20px', marginBottom: '20px' }}
				>
					Admin
				</Button>
			)}
			{showAdmin && <Admin rate={rate} setRate={setRate} />}
			<div className="bg-white">
				<Scheduler data={appointments}>
					<ViewState />
					<EditingState onCommitChanges={saveAppointment} />
					<IntegratedEditing />
					<WeekView startDayHour={9} endDayHour={19} />
					<Appointments />
					<AppointmentForm />
				</Scheduler>
			</div>
			{showDialog && <ConfirmDialog />}
			<Button
				variant="contained"
				onClick={deployNewContract}
				startIcon={<SettingsSuggestIcon />}
				style={{ marginTop: '20px', marginBottom: '20px' }}
			>
				Deploy
			</Button>
			<p className="text-white text-2xl">{newContractAddress}</p>
		</>
	);
};

export default Calender;
