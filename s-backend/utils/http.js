const fail = (status, message) => Object.assign(new Error(message), { status });
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const text = (value, name, max = 200) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max)
    throw fail(400, `${name} is required (maximum ${max} characters).`);
  return value.trim();
};
const number = (value, name, min, max) => {
  if (
    value === "" ||
    value == null ||
    typeof value === "boolean" ||
    !Number.isFinite(Number(value)) ||
    Number(value) < min ||
    Number(value) > max
  )
    throw fail(400, `${name} must be between ${min} and ${max}.`);
  return Number(value);
};
const url = (value, name = "URL") => {
  const s = text(value, name, 2000);
  let u;
  try {
    u = new URL(s);
  } catch {
    throw fail(400, `${name} must be a valid URL.`);
  }
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password)
    throw fail(400, `${name} must use http or https.`);
  return u.href;
};
const safe = (doc) => {
  const data = doc.toObject ? doc.toObject() : { ...doc };
  delete data.password;
  delete data.resetHash;
  delete data.resetExpires;
  return data;
};
module.exports = { fail, wrap, text, number, url, safe };
