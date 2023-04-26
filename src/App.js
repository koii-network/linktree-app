import "./App.css";
import HomePage from "./Home";
import "@rainbow-me/rainbowkit/styles.css";
import WalletWrapper from "./WalletWrapper";

const App = () => {
  return (
    <WalletWrapper>
      <HomePage />
    </WalletWrapper>
  );
};

export default App;
