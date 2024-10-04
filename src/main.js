import init, { exec } from "./lambda/lambda_calculus.js"

function repl()  {
  const program = document.getElementById("program").value;
  const res = exec(program);
  const resultNode = document.getElementById("result");
  if (resultNode) {
    resultNode.innerText = res;
  }
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


document.getElementsByTagName("html")[0].dataset.theme=`${getRandomInt(1, 4)}`;
await init();
