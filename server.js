const net=require("net");
const splitter="\n";

function writeData(clients,data){
	if(!data.endsWith(splitter)) data+=splitter;
	for(const client of clients){
		client.write(data);
	}
}
function createServer(portOrSocket){
	let clients=new Set();
	const server=net.createServer(client=>{
		client.setEncoding("utf-8");
		clients.add(client);
		//const id=String(Date.now())+String(Math.random())+String(Math.random()).split(".").join("");

		let clientData="";
		client.on("data",data=>{
			if(data.endsWith(splitter)){
				let message=clientData+data;
				message=message.trim();
				clientData="";
				console.log(message);
				writeData(clients,message);
			}
			else clientData+=data;
		});
		client.on("close",()=>{
			clients.delete(client);
		});
	});
	server.listen(portOrSocket,err=>{
		if(err) throw new Error("can not listen on "+portOrSocket);
		console.log("Listen on "+portOrSocket);
	});
	process.on("SIGINT",()=>{
		console.log("shutdown server...");
		for(const client of clients){
			client.end();
			clients.delete(client);
		}
		server.close();
	});
}

module.exports=createServer;
