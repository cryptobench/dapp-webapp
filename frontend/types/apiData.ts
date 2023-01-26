//TODO this should be probably shared between backend and frontend
export namespace APIData {
  export interface Dapp {
    name: string;
    id: string;
    configPath: string;
    descriptorPath: string;
    image: string;
    author: string;
    description: string;
  }
}
