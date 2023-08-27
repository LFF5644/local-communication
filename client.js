const net=require("net");
const splitter="\n";

function onEvent(client,eventName,cb){
	client.on("data",data=>{
		if(data.startsWith(eventName+"|")||eventName==="*"){
			data=data.trim();
			let [event,arg]=data.split("|");
			try{arg=JSON.parse(arg)}
			catch(e){}
			if(eventName==="*") cb(event,arg);
			else cb(arg);
		}
	});
}
function makeEvent(client,eventName,arg){
	if(eventName==="*") throw new Error("eventName not allowed!");
	client.write(`${eventName}|${JSON.stringify(arg)}${splitter}`);
}

module.exports=(portOrSocket)=>{
	const client=new net.Socket();
	process.on("exit",()=>{
		client.end();
		client.destroy();
	});
	client.on("error",err=>{
		console.log("client error:",err);
	});
	client.connect(portOrSocket);
	client.setEncoding("utf-8");
	return{
		on: (eventName,cb)=> onEvent(client,eventName,cb),
		makeEvent: (eventName,arg)=> makeEvent(client,eventName,arg),
		end: ()=>client.end(),
		destroy: ()=>client.destroy(),
	};
};
