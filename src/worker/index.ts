import memoize from "lodash/memoize";

type WorkerInstance = Worker & {
    _url?: string
}

const response = {};

const convertToWorker = <T extends (...args: any) => any>(fn: T):[ 
    (...fnArgs: Parameters<T>) => void, ()=>void
] => {
  //const memoizedFunction = memoize(fn);
  const fnString = fn.toString();
  const blob = new Blob(
    [
      `
        onmessage=(e)=>{
            const result = (${fnString})(...e.data);
            postMessage(result)
        }
        `,
    ],
    { type: "text/javascript" }
  );
  const workerURL = URL.createObjectURL(blob);
  const wUrl = workerURL.split('-').slice(-1)
  const worker: WorkerInstance = new Worker(workerURL, {name:`createWorker-${wUrl}`});
  worker._url = workerURL

  const terminateWorker=()=>{
    console.log("worker terminated")
    worker.terminate();
    worker?._url && URL.revokeObjectURL(worker._url)
  }

  // result response
  worker.onmessage = function (event) {
    response.current = event.data
    console.log("Web worker result:", response.current);
  };

  // return this hook to be called in main thread
  const workerHook=(...fnArgs: Parameters<T>)=>{
    worker.postMessage([...fnArgs]);
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log("Promise Resolve:", response.current);
        },0)
        // resolve(response.current)
        resolve('val')
    })
  }



  return [workerHook, terminateWorker]
};

export default convertToWorker;
