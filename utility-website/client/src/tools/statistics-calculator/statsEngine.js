/* ============================================================
   STATISTICS ENGINE — Pure JS (no dependencies)
   Implements: Descriptive, Correlations, T-Tests, ANOVA, Regression
   P-values via regularized incomplete beta function
   ============================================================ */

// ---- Lanczos Gamma Approximation ----
const LC = [0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
export function lnGamma(z) {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  z -= 1; let x = LC[0];
  for (let i = 1; i < 9; i++) x += LC[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

// ---- Regularized Incomplete Beta Function ----
export function betaInc(x, a, b) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  if (x > (a + 1) / (a + b + 2)) return 1 - betaInc(1 - x, b, a);
  const lnB = lnGamma(a) + lnGamma(b) - lnGamma(a + b);
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lnB);
  let f = 1, c = 1, d = 1 - (a + b) * x / (a + 1);
  if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; f = d;
  for (let m = 1; m <= 200; m++) {
    let num = m * (b - m) * x / ((a + 2*m - 1) * (a + 2*m));
    d = 1 + num * d; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1/d;
    c = 1 + num / c; if (Math.abs(c) < 1e-30) c = 1e-30; f *= c * d;
    num = -(a + m) * (a + b + m) * x / ((a + 2*m) * (a + 2*m + 1));
    d = 1 + num * d; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1/d;
    c = 1 + num / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    const delta = c * d; f *= delta;
    if (Math.abs(delta - 1) < 1e-10) break;
  }
  return front * f / a;
}

// ---- Distribution P-values ----
export const tPval2 = (t, df) => betaInc(df / (df + t*t), df/2, 0.5);
export const fPval = (f, d1, d2) => f <= 0 ? 1 : 1 - betaInc(d1*f/(d1*f+d2), d1/2, d2/2);

// ---- Basic Stats ----
export const toNums = arr => arr.map(Number).filter(v => !isNaN(v));
export const mean = a => a.reduce((s,v)=>s+v,0)/a.length;
export const variance = (a, ddof=1) => { const m=mean(a); return a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-ddof); };
export const stdDev = (a, ddof=1) => Math.sqrt(variance(a, ddof));
export const median = a => { const s=[...a].sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; };
export const mode = a => { const f={}; a.forEach(v=>{f[v]=(f[v]||0)+1;}); const mx=Math.max(...Object.values(f)); return Object.keys(f).filter(k=>f[k]===mx).map(Number); };
export const skewness = a => { const n=a.length,m=mean(a),s=stdDev(a,1); if(s===0||n<3)return 0; return (n/((n-1)*(n-2)))*a.reduce((acc,v)=>acc+((v-m)/s)**3,0); };
export const kurtosis = a => { const n=a.length,m=mean(a),s=stdDev(a,1); if(s===0||n<4)return 0; const k4=(n*(n+1))/((n-1)*(n-2)*(n-3))*a.reduce((acc,v)=>acc+((v-m)/s)**4,0); return k4-3*(n-1)**2/((n-2)*(n-3)); };

// ---- Ranking (for Spearman) ----
function rank(arr) {
  const sorted = arr.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);
  const ranks = new Array(arr.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].v === sorted[i].v) j++;
    const avg = (i + j + 1) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].i] = avg;
    i = j;
  }
  return ranks;
}

// ---- Gaussian Elimination Solver ----
function solveLinear(A, b) {
  const n = A.length;
  const aug = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < n; i++) {
    let mx = i;
    for (let j = i+1; j < n; j++) if (Math.abs(aug[j][i]) > Math.abs(aug[mx][i])) mx = j;
    [aug[i], aug[mx]] = [aug[mx], aug[i]];
    if (Math.abs(aug[i][i]) < 1e-12) continue;
    for (let j = i+1; j < n; j++) {
      const f = aug[j][i] / aug[i][i];
      for (let c = i; c <= n; c++) aug[j][c] -= f * aug[i][c];
    }
  }
  const x = Array(n).fill(0);
  for (let i = n-1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i+1; j < n; j++) x[i] -= aug[i][j] * x[j];
    x[i] /= aug[i][i] || 1;
  }
  return x;
}

// ---- Matrix Inverse (for regression SE) ----
function invertMatrix(M) {
  const n = M.length;
  const aug = M.map((row, i) => {
    const r = [...row];
    for (let j = 0; j < n; j++) r.push(i === j ? 1 : 0);
    return r;
  });
  for (let i = 0; i < n; i++) {
    let mx = i;
    for (let j = i+1; j < n; j++) if (Math.abs(aug[j][i]) > Math.abs(aug[mx][i])) mx = j;
    [aug[i], aug[mx]] = [aug[mx], aug[i]];
    if (Math.abs(aug[i][i]) < 1e-12) return null;
    const piv = aug[i][i];
    for (let j = 0; j < 2*n; j++) aug[i][j] /= piv;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const f = aug[j][i];
      for (let c = 0; c < 2*n; c++) aug[j][c] -= f * aug[i][c];
    }
  }
  return aug.map(row => row.slice(n));
}

// ============================================================
// DESCRIPTIVE STATISTICS
// ============================================================
export function descriptiveStats(data) {
  const n = data.length;
  if (n === 0) return null;
  const m = mean(data), med = median(data), mod = mode(data);
  const sd = n > 1 ? stdDev(data) : 0, v = n > 1 ? variance(data) : 0;
  const mn = Math.min(...data), mx = Math.max(...data);
  const sk = n > 2 ? skewness(data) : 0, ku = n > 3 ? kurtosis(data) : 0;
  const se = sd / Math.sqrt(n);
  return { n, mean: m, median: med, mode: mod, stdDev: sd, variance: v, min: mn, max: mx, range: mx - mn, skewness: sk, kurtosis: ku, stdError: se, sum: data.reduce((a,b)=>a+b,0) };
}

// ============================================================
// PEARSON CORRELATION
// ============================================================
export function pearsonR(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 3) return { r: null, p: null, n };
  const mx = mean(x.slice(0,n)), my = mean(y.slice(0,n));
  let sxy=0, sxx=0, syy=0;
  for (let i=0; i<n; i++) { const dx=x[i]-mx, dy=y[i]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy; }
  if (!sxx || !syy) return { r: null, p: null, n };
  const r = sxy / Math.sqrt(sxx * syy);
  const t = r * Math.sqrt((n-2) / (1 - r*r));
  return { r, p: tPval2(t, n-2), n };
}

// ============================================================
// SPEARMAN CORRELATION
// ============================================================
export function spearmanR(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 3) return { r: null, p: null, n };
  const rx = rank(x.slice(0,n)), ry = rank(y.slice(0,n));
  const res = pearsonR(rx, ry);
  res.n = n;
  return res;
}

// ============================================================
// PARTIAL CORRELATION (via regression residuals)
// ============================================================
export function partialCorr(xArr, yArr, controlArrs) {
  const n = xArr.length;
  const k = controlArrs.length;
  if (n < k + 3) return { r: null, p: null, n, df: 0 };
  const getResiduals = (target) => {
    const cols = k + 1;
    const XtX = Array(cols).fill(0).map(() => Array(cols).fill(0));
    const Xty = Array(cols).fill(0);
    for (let i = 0; i < n; i++) {
      const row = [1, ...controlArrs.map(c => c[i])];
      for (let a = 0; a < cols; a++) {
        Xty[a] += row[a] * target[i];
        for (let b = 0; b < cols; b++) XtX[a][b] += row[a] * row[b];
      }
    }
    const beta = solveLinear(XtX, Xty);
    return target.map((v, i) => {
      let pred = beta[0];
      for (let j = 0; j < k; j++) pred += beta[j+1] * controlArrs[j][i];
      return v - pred;
    });
  };
  const resX = getResiduals(xArr), resY = getResiduals(yArr);
  const result = pearsonR(resX, resY);
  const df = n - k - 2;
  if (result.r !== null && df > 0) {
    const t = result.r * Math.sqrt(df / (1 - result.r * result.r));
    result.p = tPval2(t, df);
  }
  result.df = df; result.n = n;
  return result;
}

// ============================================================
// ONE-SAMPLE T-TEST
// ============================================================
export function oneSampleT(data, testValue) {
  const n = data.length;
  if (n < 2) return null;
  const m = mean(data), s = stdDev(data), se = s / Math.sqrt(n);
  const t = (m - testValue) / se, df = n - 1;
  return { t, p: tPval2(t, df), df, mean: m, stdDev: s, se, n, testValue, meanDiff: m - testValue };
}

// ============================================================
// INDEPENDENT SAMPLES T-TEST (Welch's)
// ============================================================
export function independentT(g1, g2) {
  if (g1.length < 2 || g2.length < 2) return null;
  const n1=g1.length, n2=g2.length, m1=mean(g1), m2=mean(g2);
  const v1=variance(g1), v2=variance(g2), s1=Math.sqrt(v1), s2=Math.sqrt(v2);
  const se = Math.sqrt(v1/n1 + v2/n2);
  const t = (m1 - m2) / se;
  const df = (v1/n1 + v2/n2)**2 / ((v1/n1)**2/(n1-1) + (v2/n2)**2/(n2-1));
  return { t, p: tPval2(t, df), df, mean1:m1, mean2:m2, std1:s1, std2:s2, n1, n2, meanDiff:m1-m2, se };
}

// ============================================================
// ONE-WAY ANOVA
// ============================================================
export function oneWayAnova(groups, labels) {
  const k = groups.length, ns = groups.map(g=>g.length), N = ns.reduce((a,b)=>a+b,0);
  if (k < 2 || N < k + 1) return null;
  const gm = mean(groups.flat()), gms = groups.map(g=>mean(g));
  let ssB=0, ssW=0;
  for (let i=0; i<k; i++) { ssB += ns[i]*(gms[i]-gm)**2; for (const v of groups[i]) ssW += (v-gms[i])**2; }
  const dfB=k-1, dfW=N-k, msB=ssB/dfB, msW=ssW/dfW, f=msB/msW;
  return { f, p:fPval(f,dfB,dfW), ssB, ssW, ssT:ssB+ssW, dfB, dfW, dfT:N-1, msB, msW, groupMeans:gms, groupNs:ns, labels, grandMean:gm, N };
}

// ============================================================
// LINEAR REGRESSION (OLS)
// ============================================================
export function linearRegression(y, xs, depLabel, indepLabels) {
  const n = y.length, p = xs.length;
  if (n < p + 2) return null;
  const cols = p + 1;
  // Build X'X and X'y
  const XtX = Array(cols).fill(0).map(()=>Array(cols).fill(0));
  const Xty = Array(cols).fill(0);
  for (let i = 0; i < n; i++) {
    const row = [1, ...xs.map(x=>x[i])];
    for (let a = 0; a < cols; a++) { Xty[a]+=row[a]*y[i]; for (let b=0;b<cols;b++) XtX[a][b]+=row[a]*row[b]; }
  }
  const beta = solveLinear(XtX.map(r=>[...r]), [...Xty]);
  // Predictions & residuals
  const yBar = mean(y);
  let ssR=0, ssE=0;
  for (let i=0;i<n;i++) {
    let pred=beta[0]; for(let j=0;j<p;j++) pred+=beta[j+1]*xs[j][i];
    ssR+=(pred-yBar)**2; ssE+=(y[i]-pred)**2;
  }
  const ssT = ssR+ssE, r2=ssT?ssR/ssT:0, adjR2=1-(1-r2)*(n-1)/(n-p-1);
  const mse=ssE/(n-cols), fStat=(ssR/p)/mse;
  // Coefficient SEs
  const inv = invertMatrix(XtX);
  const coeffs = beta.map((b,j)=>{
    const se=inv?Math.sqrt(mse*inv[j][j]):0;
    const t=se?b/se:0;
    return { label: j===0?'(Constant)':indepLabels[j-1], b, se, t, p:se?tPval2(t,n-cols):1 };
  });
  return { r2, adjR2, r:Math.sqrt(r2), se:Math.sqrt(mse), fStat, fP:fPval(fStat,p,n-cols), dfReg:p, dfRes:n-cols, ssR, ssE, ssT, n, coefficients:coeffs, depLabel };
}

// ============================================================
// EUCLIDEAN DISTANCE MATRIX
// ============================================================
export function distanceMatrix(columns) {
  const n = columns[0].length;
  const dist = Array(n).fill(0).map(()=>Array(n).fill(0));
  for (let i=0;i<n;i++) for (let j=i+1;j<n;j++) {
    let sum=0; for (const col of columns) sum+=(col[i]-col[j])**2;
    dist[i][j]=dist[j][i]=Math.sqrt(sum);
  }
  return dist;
}
