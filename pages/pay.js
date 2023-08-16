import React, { useState, useEffect  } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faBarcodeRead, faPaperPlane, faFileInvoice, faChevronLeft } from '@fortawesome/pro-solid-svg-icons'; // Import icons
import { faClockNine } from '@fortawesome/pro-regular-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { initiatePayment } from "../controller/contract-control"
import { useAccount } from "wagmi";
import { useBalance } from 'wagmi';
import { useNetwork } from 'wagmi';
import { useChainModal } from '@rainbow-me/rainbowkit'; 


const Pay = () => {
  const [counter, setCounter] = useState('');
  const [formattedBalance, setFormattedBalance] = useState('0.0000'); // State for formatted balance
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data, isLoading } = useBalance({ address });

  const defaultNetworkName = 'Ethereum';
  const chainName = chain?.name || defaultNetworkName;
  const isBaseGoerli = chain?.name === 'Base Goerli';
  const [containerWidth, setContainerWidth] = useState('w-20');
  const { openChainModal } = useChainModal();
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control the modal display

  useEffect(() => {
    setContainerWidth(chain?.name === 'Base Goerli' ? 'w-24' : 'w-20');
    setIsClient(true);
  }, []);

  useEffect(() => {
    const balanceValue = parseFloat(data?.formatted || '0.0000');
    setFormattedBalance(balanceValue.toFixed(4));
}, [data]);

  const handleNumberClick = (number) => {
    if (number === '.' && counter.includes('.')) return; // Prevent more than one decimal point
    setCounter(counter + number);
  };

  const handleBackspace = () => {
    setCounter(counter.slice(0, -1));
  };

  const handlePayClick = () => {
    setShowModal(true); // Show the modal when the Pay button is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal when the close button is clicked
  };


  return (
<main className="min-h-screen flex flex-col bg-white pb-20">
      <div style={{ background: 'linear-gradient(to bottom, #0e76fd, #ffffff)' }} className="flex-grow flex flex-col">
        <Head>
          <title>Payment Page</title>
          <meta name="description" content="Handle payments here" />
        </Head>
        <div className="px-4 pb-0 pt-8 flex items-center w-full justify-between">
        <div className="flex items-center">
  <div className="bg-gray-100 rounded-full h-7 w-7 flex items-center justify-center"> 
    <FontAwesomeIcon icon={faClockNine} className="h-7 w-7 text-base-blue" />
  </div>
  <div className={`${containerWidth} h-8 rounded-4xl bg-gray-100 border-base-blue border-2 flex items-center justify-center text-xs text-black font-semibold ml-4`}
       onClick={openChainModal}>
    {isClient && isBaseGoerli ? (
      <>
        <img src="/assets/Base_Network_Logo.svg" alt="Network Logo" className="mr-1 h-3 w-3" />
        <FontAwesomeIcon icon={faEthereum} className="mr-1 text-black h-3 w-3" />
      </>
    ) : (
      <FontAwesomeIcon icon={faEthereum} className="mr-1 text-black h-3 w-3" />
    )}
    {formattedBalance}
  </div>
</div>
<div className="flex items-center relative">
          <div className=" bg-gray-100 absolute h-6 w-7 rounded-md"  />
          <FontAwesomeIcon icon={faBarcodeRead} className="h-7 w-7 text-base-blue z-10" />
        </div>
      </div>
      <div className="text-6xl font-semibold mb-4 text-black flex justify-center items-baseline -ml-10 mt-10">
            <FontAwesomeIcon icon={faEthereum} className="mr-0 text-black h-10 w-10" /> {/* Ethereum icon */}
            <span className="text-center">{counter || '0'}</span>
          </div>
          <div className="flex justify-center mb-6"> 
        <div className="bg-gray-100 rounded-4xl w-20 h-6 text-center"> 
          <span className="text-gray-800 text-sm font-bold">ETH</span>
          </div>
          </div>
          </div>
          <div className="grid grid-cols-3 gap-x-0 gap-y-8 mb-8 mt-0">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '<'].map((number, index) => (
              <button
                key={index}
                className="p-4 rounded-lg focus:outline-none focus:border-blue-300 text-black text-xl font-bold"
                onClick={() => (number === '<' ? handleBackspace() : handleNumberClick(number))}
              >
                {number}
              </button>
            ))}
          
      </div>
      <div className="w-full flex justify-center space-x-3 px-4 mb-20">
        <button onClick={handlePayClick} className="w-1/2 bg-base-blue text-white text-lg font-medium flex items-center justify-center h-12 rounded-3xl focus:outline-none">
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2 h-4 w-4 text-white" />
          Pay
        </button>
        <button className="w-1/2 bg-base-blue text-white text-lg font-medium flex items-center justify-center h-12 rounded-3xl focus:outline-none">
          <FontAwesomeIcon icon={faFileInvoice} className="mr-2 h-4 w-4 text-white" />
          Request
        </button>
      </div>
     {/* User Selection Modal */}
     {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white w-full h-full relative">
            <button onClick={handleCloseModal} className="absolute top-4 left-4 bg-gray-100 p-2 rounded-full focus:outline-none">
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4 text-black" />
            </button>
            {/* Add your user selection content here */}
          </div>
        </div>
      )}

      </main>
  );
};

export default Pay;