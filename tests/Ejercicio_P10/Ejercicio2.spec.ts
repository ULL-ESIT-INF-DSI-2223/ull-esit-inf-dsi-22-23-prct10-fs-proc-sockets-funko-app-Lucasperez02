import "mocha";
import { expect } from "chai";
import { ejecutarComando } from "../../src/Ejercicio_P10/Ejercicio2.js";

describe("Test para la función ejecutarComando", () => {
  it("Probando la función con la opción completo", () => {
    ejecutarComando(
      "completo",
      "./src/Ejercicio_P10/helloworld.txt",
      (str: string) => {
        expect(str).to.be.eql(
          "      3       3      21\nlíneas palabras y bytes\n"
        );
      }
    );
  });
  it("Probando la función con la opción líneas", () => {
    ejecutarComando(
      "líneas",
      "./src/Ejercicio_P10/helloworld.txt",
      (str: string) => {
        expect(str).to.be.eql(`3\nlíneas\n`);
      }
    );
  });
  it("Probando la función con la opción palabras", () => {
    ejecutarComando(
      "palabras",
      "./src/Ejercicio_P10/helloworld.txt",
      (str: string) => {
        expect(str).to.be.eql(`3\npalabras\n`);
      }
    );
  });
  it("Probando la función con la opción caracteres", () => {
    ejecutarComando(
      "caracteres",
      "./src/Ejercicio_P10/helloworld.txt",
      (str: string) => {
        expect(str).to.be.eql(`21\ncaracteres\n`);
      }
    );
  });
  it("Probando la función con la opción incorrecta", () => {
    ejecutarComando(
      "otra",
      "./src/Ejercicio_P10/helloworld.txt",
      (str: string) => {
        expect(str).to.be.eql(
          "Opción no válida. Ejecute de la siguiente manera: node ./dist/Ejercicio_P10/Ejercicio2.js [líneas | palabras | caracteres | completo] <fichero>"
        );
      }
    );
  });
  it("Probando la función con fichero incorrecto", () => {
    ejecutarComando("líneas", "../../incorrecto.txt", (str: string) => {
      expect(str).to.be.eql("El fichero no existe");
    });
  });
});
