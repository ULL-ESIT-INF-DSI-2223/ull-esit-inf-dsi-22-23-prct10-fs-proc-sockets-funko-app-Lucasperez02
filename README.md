# Práctica 10: Sockets Funko App

## _Ejercicio 1._

En este primer ejercicio se pide comentar cómo sería la traza del siguiente código:

```ts
import { access, constants, watch } from "fs";

if (process.argv.length !== 3) {
  console.log("Please, specify a file");
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on("change", () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

Este código tiene secuencias tanto síncronas como asíncronas y a continuación se indicará cómo se ejecuta mostrando paso a paso el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores. Se explicará el caso en el que sí existe el fichero y no hay errores, además se harán cambios en el fichero.

1. Lo primero que ocurrirá es que la función **access** entrará en la pila de llamadas para ser ejecutada.

2. Luego, en este caso que no hay errores, en la pila de llamadas entrará **console.log(`Starting to watch file ${filename}`)**, se ejecutará y saldrá de la pila.
   En la terminal tendremos

```
Terminal
Starting to watch file ./dist/Ejercicio_P10/hola.txt
```

3. Lo siguiente que ocurrirá es que se inicializará la constante **watcher**, entrando la función **watch** en la pila de llamadas.

4. A continuación, en la pila de llamadas entrará **console.log(`File ${filename} is no longer watched`)**, se ejecutará y saldrá de la pila. Esto ocurrirá porque esta secuencia es código síncrono lo que provocará que se ejecute antes que las otras secuencias asíncronas.
   En la terminal tendremos

```
Terminal
Starting to watch file ./dist/Ejercicio_P10/hola.txt
File ./dist/Ejercicio_P10/hola.txt is no longer watched
```

5. Lo siguiente que ocurrirá es que entrará en el registro de eventos de la API manejador de la función **watcher.on** que esperará a que ocurra el evento **change** en el fichero que se está controlando y luego, de la cola de manejadores, se ejecutará cuando sea posible el console.log en la pila de llamadas. En la terminal habrá lo siguiente

```
Terminal
Starting to watch file ./dist/Ejercicio_P10/hola.txt
File ./dist/Ejercicio_P10/hola.txt is no longer watched
File ./dist/Ejercicio_P10/hola.txt has been modified somehow
```

Esto ocurrirá cada vez que se haga una modificación en el fichero que se está observando y se de el evento **change**.

## _Ejercicio 2: Lectura de fichero (uso del cat y wc)_

Para este ejercicio se pide desarrollar una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto.

Para ello se pasará a la llamada de la ejecución del programa por un lado la opción de qué queremos contar (líneas, palabras, caracteres o todas ellas) y también el fichero al que se le aplicará el comando.

Lo primero será obtener tanto la opción como el fichero, de esta manera:

```ts
const fileName = process.argv[3];
const opcion = process.argv[2];
```

Y también comprobar si el fichero que se ha pasado por parámetros existe o no, en caso que no exista se acabará el proceso.

```ts
if (!existsSync(fileName)) {
  console.log("El fichero no existe");
  process.exit();
}
```

A continuación se creará un child process para el comando cat

```ts
const cat = spawn("cat", [fileName]);
```

Ahora sí se hará un switch en el que se comprobará la opción para saber qué comando de **wc** se ejecutará.

En cada caso el código será el siguiente

```ts
const wc = spawn("wc", [opción]);
cat.stdout.pipe(wc.stdin);

let wcOutput = "";
wc.stdout.on("data", (piece) => {
  wcOutput += piece;
});

wc.on("close", () => {
  process.stdout.write(`${wcOutput}\n`);
});
```

Este código se repetirá para todas las opciones y solo cambiará el parámetro opción, que será **-l** para las líneas, **-w** para las palabras, **-c** para los caracteres y sin opción para mostrar todo lo anterior.

Lo que hace el código es lo siguiente:

- Crear el child process correspondiente para el comando **wc**

- Redirigir la salida del cat a la entrada del wc

- Obtener el mensaje correspondiente al wc de manera que supongamos que puede llegar a cachos.

- Por último, una vez se ha acabado con el comando y se ha obtenido el evento **close**, lo que se hará es mostrar con el write, lo que se haya obtenido del comando wc.

Se establece también un caso default en el que si se pasa un parámetro de opción que no corresponde con los correctos se indicara con un mensaje cómo se debe ejecutar el programa.

Para este ejercicio se han realizado test y para poder probarlos se ha hecho de la siguiente manera:

- Una función tendrá lo que se ha nombrado anteriormente para realizar la lectura del fichero y la aplicación del comando.

```ts
ejecutarComando(
  opcion: string,
  fileName: string,
  cb: (str: string) => void
)
```

Como se observa, a la función se le pasa un string correspondiente a la opción, otro correspondiente a la ruta del fichero a observar y un callback que se usará para manejar los resultados en los test.

- Un ejemplo se test será el siguiente.

```ts
ejecutarComando(
  "líneas",
  "/home/usuario/P10/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Lucasperez02/helloworld.txt",
  (str: string) => {
    expect(str).to.be.eql(`3\nlíneas\n`);
  }
);
```

En este caso se está ejecutando la opción del conteo de líneas del fichero y lo que se pasará en el callback es cómo se manejará el resultado. el callback tendrá el string con el resultado y dentro de este se hará la expectativa del resultado.

## _Ejercicio 3: Cliente y servidor_

Para este ejercicio se pide, utilizando lo desarrollado en la anterior sobre los Funkos, crear una aplicación cliente-servidor que permita mediante una conexión desde nuestro cliente, modificar la lista de funkos del usuario.

Para esto se desarrollará, por un lado un servidor y por otro el cliente.

### **Servidor**

El servidor será el encargado de realizar las operaciones que vendrán en la petición del cliente.

Las operaciones podrá ser:

- Añadir funko
- Modificar funko
- Eliminar funko
- Listar funkos
- Mostrar funko concreto

Estas operaciones son las que se han desarrollado en la práctica anterior. Hay que tener en cuenta que para añadir y modificar funko habrá falta tener un objeto funko y para las demás operaciones necesitaremos el id de dicho funko. De esto se encargará el cliente, proporcionando la información en la petición que haga.

Cuando el cliente realiza la petición, el servidor recibe la operación a realizar y aplicará dicha operación a la lista de funkos del usuario cliente.

Luego de esto responderá al cliente con un mensaje de éxito o de fracaso si la operación se realizó o no correctamente.

### **Cliente**

En este caso, se desarrollará también el cliente, cuya función será, haciendo uso del **main yargs** desarrollado en la práctica anterior, se pedirá al usuario que introduzca la operación a realizar y los valores necesarios.
Lo que saquemos de aquí se enviará al servidor para que haga la operación correspondiente.

Finalmente el cliente recibirá el mensaje de éxito o fracaso que de el servidor y se mostrará por la terminal del cliente haciendo uso del **chalk**.

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Lucasperez02/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Lucasperez02?branch=main)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Lucasperez02&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Lucasperez02)
