
// 이렇게 내딴에는 정수를 저장한다고 하더라도
// MongoShell은 Javscript를 inherit 하기 때문에
// 64 bits double로 저장 된다는 사실을 알아야 한다
// 하지만 Java Driver를 쓴다면은 내가 원하는 타입으로
// 저장해줄 꺼니까 특별히 걱정할 일은 아니다.
db.numtest.insertOne({a:1})

// 뭐 이렇게 하면은 용량을 줄일 수 있다는 거다.
// db.persons.stat() 을 하면은 세부 내용을 볼 수 있다는 것 정도.
db.persons.insertOne({name:"Max",age:NumberInt(29)})

