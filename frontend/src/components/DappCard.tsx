import { APIData } from "types/apiData";

const DappCard: React.FC<{ dapp: APIData.Dapp }> = ({ dapp }) => {
  return <div> {dapp.name}</div>;
};

export default DappCard;
