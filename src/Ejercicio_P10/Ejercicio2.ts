import { existsSync } from "fs";
import { spawn } from "child_process";

const fileName = process.argv[3];
const opcion = process.argv[2];

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
      process.stdout.write(`${wcOutput}líneas\n`);
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
      process.stdout.write(`${wcOutput}palabras\n`);
    });
    break;
  }
  case "caracteres": {
    const wc = spawn("wc", ["-m"]);
    cat.stdout.pipe(wc.stdin);

    let wcOutput = "";
    wc.stdout.on("data", (piece) => {
      wcOutput += piece;
    });

    wc.on("close", () => {
      process.stdout.write(`${wcOutput}caracteres\n`);
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
      process.stdout.write(`${wcOutput}líneas palabras y bytes\n`);
    });
    break;
  }
  default: {
    console.log(
      "Opción no válida. Ejecute de la siguiente manera: node ./dist/Ejercicio_P10/Ejercicio2.js [líneas | palabras | caracteres | completo] <fichero>"
    );
    process.exit();
  }
}
