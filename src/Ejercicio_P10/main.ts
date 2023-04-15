import { ejecutarComando } from "./Ejercicio2.js";

const fileName = process.argv[3];
const opcion = process.argv[2];

ejecutarComando(opcion, fileName, (str) => {
  console.log(str);
});
