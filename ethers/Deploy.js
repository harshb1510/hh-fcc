import ethers, { ContractFactory } from "ethers";
import { Wallet } from "ethers";
import fs from "fs-extra";
import "dotenv/config";

async function main() {
  //http://127.0.0.1:7545

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

  // const encryptedJson = fs.readFileSync("./.encryptedKey.json","utf-8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson,process.env.PRIVATE_KEY_PASSWORD);
  // wallet = await wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ContractFactory(abi, binary, wallet);
  console.log("Deploying,please wait...");
  const contract = await contractFactory.deploy({ gasPrice: 1000000000000 });
  await contract.deployTransaction.wait(1);
  console.log(`Contract deployed at ${contract.address}`);

  //Get number
  const currentFavouriteNumber = await contract.retrieve();
  console.log(`Current Favourite Number:${currentFavouriteNumber.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();
  console.log(`Updated favourite number is : ${updatedFavouriteNumber}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
