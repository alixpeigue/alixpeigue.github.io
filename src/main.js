function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getColorFromVar(varName) {
  const r = document.querySelector(':root');
  const styles = getComputedStyle(r);
  const colorString = styles.getPropertyValue(varName);
  console.log(colorString);
  const color = [colorString.slice(1, 3), colorString.slice(3, 5), colorString.slice(5, 7)]
  return color.map(hex => parseInt(hex, 16)/255); 
}

// set theme in html
document.getElementsByTagName("html")[0].dataset.theme=`${getRandomInt(1, 4)}`;

// glsl canvas setup
const canvas = document.querySelector('.glslCanvas');
const sandbox = new GlslCanvas(canvas);
const primary = getColorFromVar('--primary');
console.log(primary);
console.log(canvas.clientHeight);
const secondary = getColorFromVar('--secondary');

document.addEventListener('DOMContentLoaded', () => {
  fetch(`shader.frag`)
    .then(res => res.text())
    .then(fragmentText => {
      sandbox.load(fragmentText);
      sandbox.setUniform("u_primary", ...primary);
      sandbox.setUniform("u_secondary", ...secondary);

      // Force resize due to bug in library
      sandbox.realToCSSPixels = window.devicePixelRatio || 1;

      // Lookup the size the browser is displaying the canvas in CSS pixels
      // and compute a size needed to make our drawingbuffer match it in
      // device pixels.
      var displayWidth = Math.floor(sandbox.gl.canvas.clientWidth * sandbox.realToCSSPixels);
      var displayHeight = Math.floor(sandbox.gl.canvas.clientHeight * sandbox.realToCSSPixels);

      // Check if the canvas is not the same size.
      if (sandbox.gl.canvas.width !== displayWidth || sandbox.gl.canvas.height !== displayHeight) {
          // Make the canvas the same size
          sandbox.gl.canvas.width = displayWidth;
          sandbox.gl.canvas.height = displayHeight;
          // Set the viewport to match
          sandbox.gl.viewport(0, 0, sandbox.gl.canvas.width, sandbox.gl.canvas.height);
      }
      sandbox.width = sandbox.canvas.clientWidth;
      sandbox.height = sandbox.canvas.clientHeight;
      sandbox.resizeSwappableBuffers();
    });

  window.dispatchEvent(new Event('resize'));
});
