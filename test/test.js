const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('DeCalend', function () {
	let deCalend, DeCalend;
	beforeEach(async function () {
		DeCalend = await ethers.getContractFactory('DeCalend');
		deCalend = await DeCalend.deploy();
		deCalend.deployed();
	});

	it('Should set the minutely rate', async function () {
		const tx = await deCalend.setRate(2000);

		await tx.wait();

		expect(await deCalend.getRate()).to.equal(2000);

		const [_, addr1] = await ethers.getSigners();

		await expect(deCalend.connect(addr1).setRate(1000)).to.be.revertedWith(
			'Only the owner can set the rate!'
		);
	});

	it('Should create two appointments', async function () {
		let tx = await deCalend.setRate(2);
		await tx.wait();
		const provider = ethers.provider;

		const [_, addr1, addr2] = await ethers.getSigners();
		tx = await deCalend.connect(addr1).createAppointment('Football', 60, 120, {
			value: ethers.utils.parseEther('2'),
		});
		await tx.wait();

		const balance1 = await provider.getBalance(addr1.address);

		tx = await deCalend.connect(addr2).createAppointment('PS', 60, 120, {
			value: ethers.utils.parseEther('2'),
		});
		await tx.wait();

		const balance2 = await provider.getBalance(addr2.address);

		const appointments = await deCalend.getAppointments();
		console.log('Balance 1', ethers.utils.formatEther(balance1));
		console.log('Balance 2', ethers.utils.formatEther(balance1));

		expect(appointments.length).to.equal(2);
	});
});
