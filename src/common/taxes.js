export function getTax(province) {
 const canadaRegions = [
  { name: "Alberta", code: "AB", tax: 5 },
  { name: "British Columbia", code: "BC", tax: 5 },
  { name: "Manitoba", code: "MB", tax: 5 },
  { name: "New Brunswick", code: "NB", tax: 15 },
  { name: "Newfoundland and Labrador", code: "NL", tax: 15 },
  { name: "Nova Scotia", code: "NS", tax: 15 },
  { name: "Ontario", code: "ON", tax: 13 },
  { name: "Prince Edward Island", code: "PE", tax: 15 },
  { name: "Quebec", code: "QC", tax: 5 },
  { name: "Saskatchewan", code: "SK", tax: 5 },
  { name: "Northwest Territories", code: "NT", tax: 5 },
  { name: "Nunavut", code: "NU", tax: 5 },
  { name: "Yukon", code: "YT", tax: 5 }
];
const taxPercentage = canadaRegions.find(item=> item.code === province)
return taxPercentage.tax
}