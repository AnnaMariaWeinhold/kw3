const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");

nunjucks.configure(path.join(process.cwd(), "de"));

const srcDir = path.join(__dirname, "..", "de");
const outDir = path.join(__dirname, "..", "dist", "de");

if (!fs.existsSync(path.join(outDir, ".."))) {
  fs.mkdirSync(path.join(outDir, ".."));
}
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

fs.readdirSync(srcDir, { withFileTypes: true }).forEach((dirent) => {
  if (dirent.isFile()) {
    const baseName = dirent.name.split(".")[0];
    const ext = dirent.name.split(".")[dirent.name.split(".").length - 1];

    if (ext === "njk" && baseName !== "index") {
      const newDirName = dirent.name.split(".")[0];
      if (!fs.existsSync(path.join(outDir, newDirName))) {
        fs.mkdirSync(path.join(outDir, newDirName));
      }
      const page = nunjucks.render(path.join(srcDir, dirent.name));
      fs.writeFileSync(path.join(outDir, newDirName, "index.html"), page, {
        encoding: "utf8",
      });
    } else if (baseName === "index") {
      const page = nunjucks.render(path.join(srcDir, dirent.name));
      fs.writeFileSync(path.join(outDir, baseName + ".html"), page, {
        encoding: "utf8",
      });
    }
  }
});

fs.cp(path.join(srcDir, "styles"), path.join(outDir, "..", "styles"), { recursive: true, preserveTimestamps: true }, (err) => {
  if (err) {
    console.error(err);
  }
});