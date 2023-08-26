const net=require("net");
const splitter="\n";

function createServer(portOrSocket){
	const server=net.createServer(client=>{
		client.setDefaultEncoding("utf-8");
		let clientData="";
		client.on("data",data=>{
			if(data.endsWith(splitter)){
				const message=clientData+data;
				clientData="";
				server.write(message);
			}
			else clientData+=data;
		});
	});
	server.listen(portOrSocket,err=>{
		if(err) throw new Error("can not listen on "+portOrSocket);
		console.log("Listen on "+portOrSocket);
	});
	process.on("SIGINT",()=>{
		console.log("shutdown server...");
		server.close();
	});
}

module.exports=createServer;
