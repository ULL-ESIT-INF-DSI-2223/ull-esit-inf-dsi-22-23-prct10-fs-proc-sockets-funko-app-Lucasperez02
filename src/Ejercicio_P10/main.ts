import { ejecutarComando } from "./Ejercicio2.js";

const fileName = process.argv[3];
const opcion = process.argv[2];

/*
 *En la siguiente instrucción se hará la ejecución de la función para aplicar el comando WC,
 *con la opción dada por el usuario, sobre el fichero indicado por el mismo
 */
ejecutarComando(opcion, fileName, (str) => {
  console.log(str);
});
