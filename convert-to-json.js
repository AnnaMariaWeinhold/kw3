const fs = require("node:fs");
const path = require("node:path");
const [pathToCsv] = process.argv.slice(2);



fs.readFile(path.join(__dirname, pathToCsv), { encoding: "utf8" }, (err, data) => {
  if (err) {
    throw new Error("Error reading file", err);
  }
  const rows = data.split("\n");
  const json = rows.map((row) => row.split("\t"));
  const selected = json.map((row) => {
    if (typeof row[5] === 'string') {
      row[5] = Number(row[5].replace("%", ""));
    }
    return [row[0], row[5], row[10]];
  });
  fs.writeFile(path.join(__dirname, pathToCsv.replace(".csv", ".json")), JSON.stringify(selected), "utf8", (err) => {
    if (err) {
      throw new Error(err);
    } else {
      console.log("File written to", path.join(__dirname, pathToCsv.replace(".csv", ".json")));
    }
  });
});