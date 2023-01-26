import axios from "axios";
import { APIData } from "types/apiData";
import Catalogue from "@/components/Catalogue";
export default function Home(props: { dapps: APIData.Dapp[] }) {
  return <Catalogue dapps={props.dapps} />;
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}store/dapps/`
  );
  return {
    props: { dapps: res.data.payload },
  };
}
