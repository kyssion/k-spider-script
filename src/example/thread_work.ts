import {Worker, isMainThread, parentPort, workerData} from 'worker_threads';

let a = 10
if (isMainThread) {
    let b = 10
    while (b > 0 || a > 0) {
        if (b != 0) {
            const worker = new Worker(__filename, {workerData: {num: 5}});
            worker.once('message', (result) => {
                console.log('square of 5 is :', result);
                a--;
            })
        }
    }
} else {
    if (parentPort != null) {
        parentPort.postMessage(workerData.num * workerData.num)
    }
}
