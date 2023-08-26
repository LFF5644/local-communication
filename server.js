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
	server.listen(portOrSocket,err=>console.log(err?`Server cant start '${portOrSocket}' at ${typeof(portOrSocket)==="number"?"port":"socket"}!`:`Server started at '${typeof(portOrSocket)==="number"?"port":"socket"}'`));
}

module.exports=createServer;
