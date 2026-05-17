// INR formatting (₹ / Rs.) with Indian digit grouping
function formatINR(n, withSymbol=true){
  const num = Number(n||0);
  const s = new Intl.NumberFormat('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2}).format(num);
  return withSymbol ? `Rs.${s}` : s;
}

// Convert number to words in Indian system
function numberToIndianWords(amount){
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  const num = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - num) * 100);

  if (num === 0 && paise === 0) return "Indian Rupee Zero Only";

  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

  function twoDigits(n){
    if (n < 20) return ones[n];
    const t = Math.floor(n/10), o = n%10;
    return tens[t] + (o ? " " + ones[o] : "");
  }
  function threeDigits(n){
    const h = Math.floor(n/100);
    const r = n%100;
    let out = "";
    if (h) out += ones[h] + " Hundred";
    if (r) out += (out ? " " : "") + (r<100 ? (h? "and ":"") + twoDigits(r) : twoDigits(r));
    return out;
  }

  let n = num;
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;

  const parts = [];
  if (crore) parts.push(twoDigits(crore) + " Crore");
  if (lakh) parts.push(twoDigits(lakh) + " Lakh");
  if (thousand) parts.push(twoDigits(thousand) + " Thousand");
  if (hundred) parts.push(threeDigits(hundred));

  let words = parts.join(" ");
  if (!words) words = "Zero";

  // Construct suffix for paise
  let suffix = " Only";
  if (paise) {
    suffix = " and " + twoDigits(paise) + " Paise Only";
  }

  // Use singular "Rupee" as per sample PDF
  return "Indian Rupee " + words + suffix;
}

// Days in Month helper
function daysInMonth(monthName, year){
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const idx = months.indexOf(monthName);
  if (idx === -1) return 30;
  return new Date(year, idx+1, 0).getDate();
}
