import net from "net";

net
  .createServer({ allowHalfOpen: true }, (connection) => {
    console.log("A client has connected.");

    let mensajeCompleto = "PRUEBA";
    connection.on("data", (mensaje) => {
      mensajeCompleto = mensajeCompleto + mensaje;
    });

    connection.on("end", () => {
      console.log(mensajeCompleto);
    });

    connection.on("close", () => {
      console.log("A client has disconnected.");
    });
  })
  .listen(60300, () => {
    console.log("Waiting for clients to connect.");
  });
