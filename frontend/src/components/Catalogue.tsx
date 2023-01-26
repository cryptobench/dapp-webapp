import React from "react";
import DappCard from "@/components/DappCard";
import { APIData } from "types/apiData";

const Catalogue: React.FC<{ dapps: APIData.Dapp[] }> = ({ dapps }) => {
  return (
    <div>
      {dapps.map((dapp) => (
        <DappCard key={dapp.id} dapp={dapp} />
      ))}
    </div>
  );
};

export default Catalogue;
