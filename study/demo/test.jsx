import React from "react";
import {createRoot} from "react-dom/client.js";

const App = () => {
  return <div>初始化APP</div>
}

createRoot(document.getElementById("app")).render(<App/>)

React.createElement("h1", {title: "foo"}, "hello")

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello world"
  }

}
const text = document.createTextNode("")
text["nodeValue"] = element.props.children

