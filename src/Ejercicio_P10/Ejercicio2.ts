import { existsSync, watchFile } from "fs";
import { spawn } from "child_process";

const fileName = process.argv[3];
const opcion = process.argv[2];

/**
 * Función que comprobará los cambios en el fichero
 */
watchFile(fileName, (curr, prev) => {
  // Con este condicional se comprobará si existe o no el fichero
  if (!existsSync(fileName)) {
    console.log("El fichero no existe");
    process.exit();
  }

  const cat = spawn("cat", [fileName]);
  // Switch que comprobará las opciones válidas para el -wc
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
      console.log(
        "Opción no válida. Ejecute de la siguiente manera: node ./dist/Ejercicio_P10/Ejercicio2.js [líneas | palabras | carácteres | completo] <fichero>"
      );
      process.exit();
    }
  }
  console.log(`File was ${prev.size} bytes before it was modified.`);
  console.log(`Now file is ${curr.size} bytes.`);
});
