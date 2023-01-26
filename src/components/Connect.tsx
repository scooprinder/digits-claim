import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ConnectProps } from '../types/PropTypes'

export function Connect({msg = 'connect'}: ConnectProps) {
  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
        {isConnected && (
          <button className="button" onClick={() => disconnect()}>
            {address} - Disconnect
          </button>
        )}

        {!isConnected && connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button key={x.id} className="button" onClick={() => connect({ connector: x })}>
              {msg}
              {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
            </button>
          ))}

      {error && <div>{error.message}</div>}
    </>
  )
}
