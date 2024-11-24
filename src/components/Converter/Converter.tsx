import { useEffect, useState } from "react";
import { FaReact } from "react-icons/fa";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
}

type CryptoData = Crypto[];

const Converter = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [fromCrypto, setFromCrypto] = useState<string>('');
  const [toCrypto, setToCrypto] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.coincap.io/v2/assets")
      .then((response) => response.json())
      .then((data) => setCryptoData(data.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleFromCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCrypto(e.target.value);
  };

  const handleToCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCrypto(e.target.value);
  };

  useEffect(() => {
    if (cryptoData && fromCrypto && toCrypto) {
      const fromPrice = cryptoData.find(crypto => crypto.id === fromCrypto)?.priceUsd;
      const toPrice = cryptoData.find(crypto => crypto.id === toCrypto)?.priceUsd;
      
      if (fromPrice && toPrice) {
        const amountInUsd = amount * parseFloat(fromPrice);
        const converted = amountInUsd / parseFloat(toPrice);
        setConvertedAmount(converted);
      }
    }
  }, [amount, fromCrypto, toCrypto, cryptoData]);

  if (!cryptoData) {
    return (
      <div className="loader_div">
        <div className="loader"></div>
      </div>
    );
  }

  

  return (
    <div className="converter_div">
      <div className="converter">
        <header className="converter_header">
          <h3>Currency Converter</h3>
          <FaReact className="icon-react" />
        </header>
        <main className="convert_main">
          <div className="input_div" >
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              step="any"
            />
            <select value={fromCrypto} onChange={handleFromCryptoChange}>
            <option value="">...</option>
              {cryptoData.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="input_div">
            <input
              type="number"
              value={convertedAmount ?? ''}
              readOnly
            />
            <select value={toCrypto} onChange={handleToCryptoChange}>
              <option value="">...</option>
              {cryptoData.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Converter;
