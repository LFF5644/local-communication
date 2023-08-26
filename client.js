const net=require("net");
const splitter="\n";

function onEvent(client,eventName,cb){
	client.on("data",msg=>{
		if(msg.startsWith(eventName+"|")||eventName==="*"){
			let data=substring((eventName+"|").length,splitter.length);
			try{data=JSON.parse(data)}
			catch(e){}
			cb(data);
		}
	});
}
function makeEvent(client,eventName,arg){
	if(eventName==="*") throw new Error("eventName not allowed!");
	client.write(`${eventName}|${JSON.stringify(arg)}${splitter}`);
}

module.exports=(portOrSocket)=>{
	const client=net.connect(typeof(portOrSocket)==="string"?portOrSocket:{path:portOrSocket});
	client.setDefaultEncoding("utf-8");
	process.on("exit",()=>client.end());
	return{
		on: (eventName,cb)=> onEvent(client,eventName,cb),
		makeEvent: (eventName,arg)=> makeEvent(client,eventName,arg),
		end: client.end,
	};
};
