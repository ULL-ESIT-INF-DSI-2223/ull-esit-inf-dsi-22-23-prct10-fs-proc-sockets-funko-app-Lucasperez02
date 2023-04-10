import net from "net";

const client = net.connect({ port: 60300 });

//console.log("Sale del data");
client.write("Mensaje del cliente al server");
client.end();

//Para la respuesta del servidor
let mensajeCompleto = "";
client.on("data", (mensaje) => {
  mensajeCompleto = mensajeCompleto + mensaje;
});

//client.on("end")
