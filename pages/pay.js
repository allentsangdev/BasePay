import React, { useState } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faBarcodeRead, faPaperPlane, faFileInvoice } from '@fortawesome/pro-solid-svg-icons'; // Import icons
import { faClockNine } from '@fortawesome/pro-regular-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { initiatePayment } from "../controller/contract-control"
import { useAccount } from "wagmi";
import { useBalance } from 'wagmi';

const Pay = () => {
  const [counter, setCounter] = useState('');

  
  const { address } = useAccount();
  const { data, isLoading } = useBalance({ address });

  if (isLoading) return <div>Loading...</div>;

  const balanceValue = parseFloat(data?.formatted || '0.0000');
  const formattedBalance = balanceValue.toFixed(4);


  const handleNumberClick = (number) => {
    if (number === '.' && counter.includes('.')) return; // Prevent more than one decimal point
    setCounter(counter + number);
  };

  const handleBackspace = () => {
    setCounter(counter.slice(0, -1));
  };

  // @dev Allen's testing function. Feel free to amend during integration
  // @dev initiatePayment return true if txn successful false if otherwise
  // @dev can build front-end pop-up messages based on the returned bool
  const handlePayClick = async () => { 
    console.log(window.ethereum)
    const status = await initiatePayment(window.ethereum, "0xAB60DdFE027D9D86C836e8e5f9133578E102F720", "0.001"  )
    console.log(status)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Head>
        <title>Payment Page</title>
        <meta name="description" content="Handle payments here" />
      </Head>
      <div className="px-4 pb-0 pt-8 flex items-center w-full justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faClockNine} className="mr-4 h-7 w-7 text-gray-600" /> {/* New clock icon */}
          <div className="w-20 h-8 border rounded-4xl border-2.5 border-gray-600 flex items-center justify-center text-xs text-black font-semibold">
            <FontAwesomeIcon icon={faEthereum} className="mr-1 text-black h-3 w-3" />  {formattedBalance}
          </div>
        </div>
        <FontAwesomeIcon icon={faBarcodeRead} className="ml-4 mr-0 h-7 w-7 text-gray-600" />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center pb-24">
        <main className="text-center mt-0">
        <div className="text-6xl font-semibold mb-8 text-black flex justify-center items-baseline -ml-10">
            <FontAwesomeIcon icon={faEthereum} className="mr-0 text-black h-10 w-10" /> {/* Ethereum icon */}
            <span className="text-center">{counter || '0'}</span>
          </div>
          <div className="grid grid-cols-3 gap-x-20 gap-y-8 mb-8 mt-10">
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
        </main>
        <div className="w-full flex justify-center space-x-3 px-4">
        <button onClick={handlePayClick} className="w-1/2 bg-base-blue text-white text-lg font-medium flex items-center justify-center h-12 rounded-3xl focus:outline-none">
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2 h-4 w-4 text-white" />
          Pay
        </button>
        <button className="w-1/2 bg-base-blue text-white text-lg font-medium flex items-center justify-center h-12 rounded-3xl focus:outline-none">
          <FontAwesomeIcon icon={faFileInvoice} className="mr-2 h-4 w-4 text-white" /> 
          Request
        </button>
      </div>
      </div>
    </div>
  );
};

export default Pay;