"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { Fly402AutoClient } from "@402fly/client";

interface Fly402ClientContextType {
  client: Fly402AutoClient | null;
  walletAddress: string | null;
  isConnected: boolean;
  isReady: boolean;
}

const Fly402ClientContext = createContext<Fly402ClientContextType>({
  client: null,
  walletAddress: null,
  isConnected: false,
  isReady: false,
});

export function Fly402ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey, wallet, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [client, setClient] = useState<Fly402AutoClient | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Clean up previous client
    if (client) {
      client.close();
      setClient(null);
    }

    // If wallet is connected, create a client
    if (publicKey && wallet && signTransaction) {
      try {
        // Create a wallet adapter wrapper for Fly402Client
        // For now, we'll create a temporary keypair for demo
        // In production, you'd want to integrate wallet adapter's signTransaction

        // TODO: This is a simplified approach - create a demo keypair
        // In a real app, you'd want to use the wallet's signTransaction method
        const demoKeypair = Keypair.generate();

        const rpcUrl = connection.rpcEndpoint;
        const newClient = new Fly402AutoClient(demoKeypair, rpcUrl, {
          maxPaymentAmount: "5.0",
        });

        setClient(newClient);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to create X402 client:", error);
        setIsReady(false);
      }
    } else {
      setIsReady(true); // Ready but not connected
    }

    return () => {
      if (client) {
        client.close();
      }
    };
  }, [publicKey, wallet, signTransaction, connection]);

  return (
    <Fly402ClientContext.Provider
      value={{
        client,
        walletAddress: publicKey?.toString() || null,
        isConnected: !!publicKey,
        isReady,
      }}
    >
      {children}
    </Fly402ClientContext.Provider>
  );
}

export function useFly402Client() {
  const context = useContext(Fly402ClientContext);
  if (!context) {
    throw new Error("useFly402Client must be used within Fly402ClientProvider");
  }
  return context;
}
