import { existsSync, watchFile } from "fs";
import { spawn } from "child_process";

const fileName = process.argv[3];
const opcion = process.argv[2];

watchFile(fileName, (curr, prev) => {
  if (!existsSync(fileName)) {
    console.log("El fichero no existe");
    process.exit();
  }

  const cat = spawn("cat", [fileName]);
  switch (opcion) {
    case "líneas": {
      const wc = spawn("wc", ["-l"]);
      cat.stdout.pipe(wc.stdin);

      let wcOutput = "";
      wc.stdout.on("data", (piece) => {
        wcOutput += piece;
      });

      wc.on("close", () => {
        process.stdout.write(`${wcOutput} líneas`);
      });
      break;
    }
    case "palabras": {
      const wc = spawn("wc", ["-w"]);
      cat.stdout.pipe(wc.stdin);

      let wcOutput = "";
      wc.stdout.on("data", (piece) => {
        wcOutput += piece;
      });

      wc.on("close", () => {
        process.stdout.write(`${wcOutput} palabras`);
      });
      break;
    }
    case "carácteres": {
      const wc = spawn("wc", ["-m"]);
      cat.stdout.pipe(wc.stdin);

      let wcOutput = "";
      wc.stdout.on("data", (piece) => {
        wcOutput += piece;
      });

      wc.on("close", () => {
        process.stdout.write(`${wcOutput} carácteres`);
      });
      break;
    }
    case "completo": {
      const wc = spawn("wc");
      cat.stdout.pipe(wc.stdin);

      let wcOutput = "";
      wc.stdout.on("data", (piece) => {
        wcOutput += piece;
      });

      wc.on("close", () => {
        process.stdout.write(`${wcOutput} líneas palabras y bytes`);
      });
      break;
    }
    default: {
      console.log("Opción no válida");
      process.exit();
    }
  }
  console.log(`File was ${prev.size} bytes before it was modified.`);
  console.log(`Now file is ${curr.size} bytes.`);
});
