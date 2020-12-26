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

module.exports ={
    generateMessage,
    generateLocation
}