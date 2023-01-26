import { AnyAction } from "redux";

type State = {
  apps: { title: String }[];
};

export function rootReducer(state: State | undefined, action: AnyAction) {
  //fill it with logic later
  return state || { apps: [] };
}
