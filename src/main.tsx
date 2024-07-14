import "./style.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WorkerResultHandler from "./worker/WorkerResultHandler.tsx";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { invoke } from "@tauri-apps/api";
import convertToWorker from "./worker/index.ts";

//calls rust greet function
const greet = () => {
  invoke("greet", { name: "Israel" }).then((response) => console.log(response));
};

const [multiply, terminate] = convertToWorker((val1: number, val2: number) => {
  console.log("args", val1, val2);
  return val1 * val2;
});

export default () => {
  const [result, setResult] = useState();
  const [clicked, setClicked] = useState<string | null>();

  const firstRef = useRef<HTMLInputElement>(null);
  const secRef = useRef<HTMLInputElement>(null);

  const calculate = () => {
    const first = firstRef.current;
    const second = secRef.current;
    [first, second].forEach(async(input) => {
      if (!input) return;
      if (!first) return;
      if (!second) return;
      const res = await multiply(+first.value, +second.value);
      console.log('res', res)
    });
  };


  const terminateFn = () => {
    terminate()
    setClicked("terminate");
  }

  useEffect(() => {
    if (!window.Worker) {
      console.log("Your browser doesn't support web workers.");
    }
    return () => {
      terminate();
    };
  }, []);

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img
          src={typescriptLogo}
          className="logo vanilla"
          alt="TypeScript logo"
        />
      </a>
      <h1>Vite + TypeScript</h1>
      <div className="card">
        <button
          className={clicked === "stop-timer" ? "active" : ""}
          onClick={() => {
            setClicked("stop-timer");
          }}
          type="button"
        >
          Stop Timer
        </button>
        <button
          className={clicked === "terminate" ? "active" : ""}
          onClick={terminateFn}
          type="button"
        >
          Terminate Worker
        </button>
      </div>
      <div className="controls" tabIndex={0}>
        <form>
          <div>
            <label htmlFor="number1">Multiply number 1: </label>
            <input type="text" id="number1" ref={firstRef} />
          </div>
          <div>
            <label htmlFor="number2">Multiply number 2: </label>
            <input type="text" id="number2" ref={secRef} />
          </div>
          <div className="card">
            <button onClick={calculate} type="button">
              Calculate
            </button>
          </div>
        </form>

        <WorkerResultHandler data={result} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  );
};
