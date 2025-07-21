import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x44Ed447764c0BF96BF2748E1989c31263bF246a6";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  async function requestAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }


  const handleSet = async () => {
    setError(null)
    try {
      if (!text) {
        setError("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
       setText("")
      } else {
        setError("MetaMask not found. Please install MetaMask to use this application.");
      }
       
    } catch (error) {
      console.error("Error setting message:", error);
     
      setError(error.message)
    }
  };
  // function to getmessage from the contract
  const handleGet = async () => {
    try {
      

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const messageContract = await contract.getMessage();
        setMessage(messageContract);
        console.log("Current message:", messageContract);

      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };
  return (
   <div style={{ backgroundColor: "#f8f9fa", minHeight: "300px", margin: "40px auto",padding:"10px 20px", maxWidth: "500px" }}>
  <div style={{  fontFamily: "Arial, sans-serif" }}>
    <p>Address: {account}</p>
    <h1 style={{ marginBottom: "1rem" }}>Set Message on Smart Contract</h1>
    <div style={{display: "block"}}>
<input
      type="text"
      placeholder="Set message"
      value={text}
      onChange={(e) => setText(e.target.value)}
      style={{
        padding: "9px",
        margin:"9px 0px",
        fontSize: "16px",
        marginRight: "10px",
        width: "250px",
        height: "30px",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}
    />
    
    <button
      onClick={handleSet}
      style={{
        padding: "6px 10px",
        fontSize: "15px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      Set Message
    </button>
    </div>
    
    <p style={{color:"red"}}>
      {error}
    </p>
    
  </div>

  <div style={{ padding: "", }}>
    <button
      onClick={handleGet}
      style={{
        padding: "6px 10px",
        fontSize: "15px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "1rem"
      }}
    >
      Get Message
    </button>
    
    <p style={{ fontSize: "18px", color: "#333" }}>
      <strong>Current message:</strong> <span style={{  fontSize:"25px" }}>{message}</span>
    </p>
  </div>
</div>

  );
}

export default App;