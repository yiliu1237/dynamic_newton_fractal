//z = re + i*im
class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  sub(c) {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }

  div(c) {
    const denom = c.re * c.re + c.im * c.im;
    const re = (this.re * c.re + this.im * c.im) / denom;
    const im = (this.im * c.re - this.re * c.im) / denom;
    return new Complex(re, im);
  }

  mag() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  pow(n) {
    let result = new Complex(1, 0);
    for (let i = 0; i < n; i++) {
      result = result.mult(this);
    }
    return result;
  }

  realPow(n) {
    const r = this.mag();
    const theta = Math.atan2(this.im, this.re);
    const rn = Math.pow(r, n);
    const angle = theta * n;
    return new Complex(rn * Math.cos(angle), rn * Math.sin(angle));
  }

  sin() {
    return new Complex(Math.sin(this.re) * Math.cosh(this.im),
                       Math.cos(this.re) * Math.sinh(this.im));
  }

  cos() {
    return new Complex(Math.cos(this.re) * Math.cosh(this.im),
                      -Math.sin(this.re) * Math.sinh(this.im));
  }

  equals(c, tolerance = 1e-3) {
    return this.sub(c).mag() < tolerance;
  }
}


function computeHeavy(z, power) {
  const zPowMinus1 = z.realPow(power - 1);
  const zPow = zPowMinus1.mult(z);
  const sinZ = z.sin();
  const cosZ = z.cos();
  return [zPowMinus1, zPow, sinZ, cosZ];
}


// Track roots & assign colors
function findOrRegisterRoot(r) {
  for (let i = 0; i < rootColors.length; i++) { //If r is close enough to a previously found root 
    if (r.equals(rootColors[i].root)) {
      return rootColors[i];
    }
  }

  let newColor = color(random(150, 255), random(100, 200), random(150, 255));
  let obj = { root: r, col: newColor };
  rootColors.push(obj);
  return obj;
}

// Smooth gradient by iteration count
//This function creates a shaded version of a base color depending on 1. The number of iterations it took to converge
//2. The root it converged to (Faster convergence -> brighter color; Slower convergence -> darker color)
//rootObj: the object { root: ..., col: ... } returned from findOrRegisterRoot()
//iter: how many Newton iterations this pixel took to converge
function colorRoot(rootObj, iter) { 
  let base = rootObj.col;
  let f = map(iter, 0, maxIter, 1.0, 0.3);
  return color(red(base) * f, green(base) * f, blue(base) * f);
}
