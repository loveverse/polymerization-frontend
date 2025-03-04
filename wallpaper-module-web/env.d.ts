/// <reference types="vite/client" />
declare module "*.vue" {
  import type {DefineComponent} from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss";

// declare module "vue-router" {
// interface RouteMeta {
//   label: string;
// }
// }
