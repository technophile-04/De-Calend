import React, { useState } from 'react';
import { Box, Button, Slider } from '@material-ui/core';
import { getContractWrite } from '../utils';
import { ethers } from 'ethers';

const marks = [
	{
		value: 0.0,
		label: 'Free',
	},
	{
		value: 0.02,
		label: '0.02 ETH/min',
	},
	{
		value: 0.04,
		label: '0.04 ETH/min',
	},
	{
		value: 0.06,
		label: '0.06 ETH/min',
	},
	{
		value: 0.08,
		label: '0.08 ETH/min',
	},
	{
		value: 0.1,
		label: 'Expensive',
	},
];

const Admin = ({ rate, setRate }) => {
	const handleSliderChange = (event, newValue) => {
		setRate(newValue);
	};

	const [loading, setLoading] = useState(false);

	const saveRate = async () => {
		const deCalendContract = getContractWrite();
		setLoading(true);
		const tx = await deCalendContract.setRate(
			ethers.utils.parseEther(rate.toString())
		);
		await tx.wait();
		setLoading(false);
	};

	return (
		<div className="bg-white my-4 px-20 py-6">
			<Box>
				<h3>Set Your Minutely Rate</h3>
				<Slider
					defaultValue={rate}
					step={0.001}
					min={0}
					max={0.1}
					valueLabelDisplay="auto"
					marks={marks}
					onChangeCommitted={handleSliderChange}
				/>
				<br />
				<br />
				<Button onClick={saveRate} variant="contained">
					{loading ? 'Loading...' : 'save configuration'}
				</Button>
			</Box>
		</div>
	);
};

export default Admin;
