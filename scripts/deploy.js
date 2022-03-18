const hre = require('hardhat');

async function main() {
	const DeCalend = await hre.ethers.getContractFactory('DeCalend');
	const deCalend = await DeCalend.deploy();

	await deCalend.deployed();

	console.log('DeCalend deployed to:', deCalend.address);

	saveFrontendFiles(deCalend.address);
}

function saveFrontendFiles(contractAddress) {
	const fs = require('fs');

	const contractsDir = __dirname + '/../frontend/src/contracts';

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir);
	}

	fs.writeFileSync(
		contractsDir + '/contract-address.json',
		JSON.stringify({ contractAddress: contractAddress }, undefined, 2)
	);

	const DeCalend = artifacts.readArtifactSync('DeCalend');

	fs.writeFileSync(
		contractsDir + '/DeCalend.json',
		JSON.stringify(DeCalend, null, 2)
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
