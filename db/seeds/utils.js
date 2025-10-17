const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookupObject = (arr, key, value) => {
  const lookupObj = {};
  arr.forEach((obj) => {
    const lookupKey = obj[key];
    const lookupValue = obj[value];
    if (lookupKey && lookupObj) {
      lookupObj[lookupKey] = lookupValue;
    }
  });
  return lookupObj;
};
