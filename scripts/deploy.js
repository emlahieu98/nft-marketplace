const hre = require("hardhat");

async function main() {
  // Deploy nft market
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  // Deploy nft
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
