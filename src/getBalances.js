import { Alchemy, Network } from "alchemy-sdk";
import { useState } from "react";

import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function GetBalances() {
  //! GET ETH BALANCE && TOKENs BALANCES
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenData, setTokenData] = useState([]); // Estado para almacenar los datos de los tokens
  const [address, setAddress] = useState(""); // Estado para almacenar la dirección del usuario

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

  const getBalances = async () => {
    try {
      const balance = await alchemy.core.getBalance(address, "latest");
      setEthBalance(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }

    try {
      const balances = await alchemy.core.getTokenBalances(address);
      const nonZeroBalances = balances.tokenBalances.filter(
        (token) => token.tokenBalance !== "0"
      );
      console.log(`Token balances of ${address} \n`);
      let i = 1;
      // Loop through all tokens with non-zero balance
      const tokenInfo = [];
      for (let token of nonZeroBalances) {
        // Get balance of token
        let balance = token.tokenBalance;

        // Get metadata of token
        const metadata = await alchemy.core.getTokenMetadata(
          token.contractAddress
        );
        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata.decimals);
        balance = balance.toFixed(2);

        // Push token info into array
        tokenInfo.push({
          name: metadata.name,
          balance: `${balance} ${metadata.symbol}`,
        });
      }
      // Update state with token data
      setTokenData(tokenInfo);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleButtonClick = () => {
    if (address) {
      getBalances();
    } else {
      // Si la dirección está vacía, establecemos la respuesta en 0
      setTokenData([]);
      setEthBalance(0);
    }
  };
  console.log(tokenData);
  console.log(ethBalance);

  return (
    <>
      <br></br>
      <div className="App">
        <label htmlFor="address">
          <h1>Enter Ethereum Address:</h1>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={handleInputChange}
        />
        <button id="submitButton" onClick={handleButtonClick}>
          Get Balance
        </button>
      </div>
      <div className="App">
        <h1>Eth Balance</h1>
        <li>
          Eth balance:{" "}
          {ethBalance && typeof ethBalance._hex === "string"
            ? parseInt(ethBalance._hex) / Math.pow(10, 18)
            : 0}
        </li>
        <br></br>
        <h1>Tokens Balances</h1>
        {tokenData.map((token, index) => (
          <>
            <li key={index}>
              {index + 1}. {token.name}: {token.balance}
            </li>{" "}
            <br></br>
          </>
        ))}
      </div>
    </>
  );
}
export default GetBalances;
