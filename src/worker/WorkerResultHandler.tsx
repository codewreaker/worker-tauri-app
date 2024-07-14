import React from "react";
import "./style.css";

interface ResultData {
  timer?: string;
  [key: string]: any;
}
const Entries = new Map<string, any>();

export default ({ data }: { data: ResultData }) => {
  if (typeof data === "string") {
    const key = React.useId();
    Entries.set(key, { [key]: data });
  } else if (data && typeof data === "object") {
    if (data.hasOwnProperty("timer")) {
      Entries.set("timer", data);
    }
  }
  return (
    <div className="result">
      {[...Entries].map(([k, val]) => (
        <div className={"entry"} key={k}>
          {val[k]}
        </div>
      ))}
    </div>
  );
};
