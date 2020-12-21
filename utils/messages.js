const generateMessage = (username , text)=>{
    return {
        message_id: createUUID(),
        username : username,
        text : text,
        createdAt : new Date().getTime()
    }
}

const generateLocation= (username ,locationlink)=>{
    return {
        message_id: createUUID(),
        username,
        locationlink ,
        createdAt :new Date().getTime()
    }

}

function createUUID(){
   
    let dt = new Date().getTime()
    
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0
        dt = Math.floor(dt/16)
        return (c=='x' ? r :(r&0x3|0x8)).toString(16)
    })
    
    return uuid
}

module.exports ={
    generateMessage,
    generateLocation
}