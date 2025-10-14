"use client";
import { StacksConnectButton } from "./StacksConnectButton";

export const ActionButtonList = () => {
  return (
    <div>
      <StacksConnectButton
        variant="outline"
        onConnect={(address) => console.log("Connected:", address)}
        onDisconnect={() => console.log("Disconnected")}
      />
    </div>
  );
};
