import { Connect } from '../components/Connect';
import { BigNumber, ethers } from 'ethers';
import { DigitsContract } from '../components/Constants';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import digitsAbi  from "../abi/Digits.json";
import { useState } from 'react';

function Page() {
  const { address, isConnected } = useAccount()
  let [balance, setBalance] = useState('0');
  let [claimable, setClaimable] = useState('0');
  
  useContractRead({
    address: DigitsContract,
    abi: digitsAbi,
    functionName: "balanceOf",
    args: [address],
    onSuccess(data) {
      setBalance(ethers.utils.formatEther(data as BigNumber)) 
    }
  })

  const withdrawable = useContractRead({
    address: DigitsContract,
    abi: digitsAbi,
    functionName: "withdrawableDividendOf",
    args: [address],
    onSuccess(data) {
        setClaimable(ethers.utils.formatEther(data as BigNumber))
    }
  })

  const {config} = usePrepareContractWrite({
    address: DigitsContract,
    abi: digitsAbi,
    functionName: "claim",
    args: []
  })

  const {data, write, isError, error} = useContractWrite(config);

  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
        withdrawable.refetch();
    }
  })

  return (
    <>
      <div className="wrapper crt">
        <Connect />

        {isConnected && (
            <>
            <div className="info">
                <p>$DIGITS: {balance}</p>
                <p>Claimable: {claimable} $DAI</p>
            </div>
            <div>
                <button
                    className="button"
                    onClick={() => write?.()}
                >{isLoading ? 'Claiming' : 'Claim'}</button>
            </div>
            {isError && (
                <div className="error">
                    {error?.message}
                </div>
            )}
            </>
        )}
      </div>
    </>
  )
}

export default Page
