import { existsSync } from "fs";
import { spawn } from "child_process";

/**
 * Esta función será la encargada de hacer la lectura del fichero que se pasará por parámetros.
 * @param opcion
 * @param fileName
 * @param cb
 * @returns
 */
export function ejecutarComando(
  opcion: string,
  fileName: string,
  cb: (str: string) => void
) {
  // Con este condicional se comprobará si existe o no el fichero
  if (!existsSync(fileName)) {
    cb("El fichero no existe");
    return;
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

      wc.once("close", () => {
        cb(`${wcOutput}líneas\n`);
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

      wc.once("close", () => {
        cb(`${wcOutput}palabras\n`);
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

      wc.once("close", () => {
        cb(`${wcOutput}caracteres\n`);
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

      wc.once("close", () => {
        cb(`${wcOutput}líneas palabras y bytes\n`);
      });
      break;
    }
    default: {
      cb(
        "Opción no válida. Ejecute de la siguiente manera: node ./dist/Ejercicio_P10/Ejercicio2.js [líneas | palabras | caracteres | completo] <fichero>"
      );
      return;
    }
  }
}
