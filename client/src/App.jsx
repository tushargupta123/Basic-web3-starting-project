// import { EthProvider } from "./contexts/EthContext";
// import Intro from "./components/Intro/";
// import Setup from "./components/Setup";
// import Demo from "./components/Demo";
// import Footer from "./components/Footer";
// import "./App.css";

// function App() {
//   return (
//     <EthProvider>
//       <div id="App" >
//         <div className="container">
//           <Intro />
//           <hr />
//           <Setup />
//           <hr />
//           <Demo />
//           <hr />
//           <Footer />
//         </div>
//       </div>
//     </EthProvider>
//   );
// }


import React,{useState,useEffect} from "react";
import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json";
import "./App.css";

const App = () => {

  const [state,setState] = useState({
    web3:null,
    contract:null,
  });
  const [storageValue,setStorageValue] = useState(null);

  useEffect(() => {
    const init = async () => {
      try{
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = SimpleStorage.networks[networkId];
        console.log("Contract address : ",deployedNetwork.address);
        const instance = new web3.eth.Contract(
          SimpleStorage.abi,
          deployedNetwork && deployedNetwork.address
        );

        setState({web3,contract:instance});
      }catch(error){
        alert("failed to load web3 or contract");
        console.log(error);
      }
    };
    init();
  },[]);

  useEffect(() => {
    async function getValue(){
      const {contract} = state;
      const value = await contract.methods.get().call();
      setStorageValue(value);
    }
    state.contract && getValue();
  },[state.contract]);

  return(
    <div className="App">
      <div>The stored value is : {storageValue}</div>
    </div>
  )

}

export default App;