import {App} from "vue";
import {PiniaPluginContext} from "pinia";

type Options = {
  key?: Symbol | string;
}

const PRIMARY_KEY = Symbol("PRIMARY_KEY");

export const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}
export const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
}


// export const piniaPlugin = (options: Options) => {
//   return (context: PiniaPluginContext) => {
//     const {store} = context
//     const data = getStorage(options.key ?? PRIMARY_KEY)
//   }
// }
