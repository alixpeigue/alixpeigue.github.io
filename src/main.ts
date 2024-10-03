import './style.css';
import 'htmx.org';
import '/pages/resume.html';
import '/pages/presentation.html';

function getRandomInt(min: number, max: number) : number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


document.getElementsByTagName("html")[0].dataset.theme=`${getRandomInt(1, 4)}`;
