const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('DeCalend', function () {
	it('Set Rate', async function () {
		const DeCalend = await ethers.getContractFactory('DeCalend');
		const deCalend = await DeCalend.deploy();
		deCalend.deployed();

		const tx = await deCalend.setRate(2000);

		await tx.wait();

		expect(await deCalend.getRate()).to.equal(2000);

		const [_, addr1] = await ethers.getSigners();

		await expect(deCalend.connect(addr1).setRate(1000)).to.be.revertedWith(
			'Only the owner can set the rate!'
		);
	});
});
