db.persons.insertOne({
    name:"Chrissy",
    age:41
},{
    writeConcern:{
        // 서버에게 write 한다는 것을 알리는 것임
        // 성공 하든 말든 response를 서버로 부터 받지 않는다는 뜻임.
        w:0
    }
})

db.persons.insertOne({
    name:"Alex",
    age:36
},{
    writeConcern:{
        w:1
    }
})

db.persons.insertOne({
    name:"Alexa",
    age:36
},{
    writeConcern:{
        w:1,
        // default가 false이다.
        j:true
    }
})

db.persons.insertOne({
    name:"Alexa123",
    age:36
},{
    writeConcern:{
        w:1,
        // default가 false이다.
        j:true,
        wtimeout:200
    }
})