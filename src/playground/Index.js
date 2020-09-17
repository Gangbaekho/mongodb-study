db.contacts.find({"dob.age":{$gt:60}}).pretty()

db.contacts.explain("executionStats").find({"dob.age":{$gt:60}})

// dob age를 asc로 ordering 한다는 것이다.
db.contacts.createIndex({"dob.age": 1})

// dob age를 desc로 ordering 한다는 것이다.
db.contacts.createIndex({"dob.age": 1})

db.contacts.dropIndex({"dob.age":1})

db.contacts.createIndex({gender:1})

// 일단 이 쿼리 자체가 documents의 절반정도를 가져오는 쿼리이기 때문에
// index를 거는게 조금 의미가 퇴색되는 것도 있다.
// 또한 gender를 index로 걸면 애매한게 gender를 ordering 해봤자
// male, female 이라는 두개로만 나뉘기 때문에 하지 바람직 하지 않다.
db.contacts.explain("executionStats").find({gender:"male"})

db.contacts.dropIndex({gender:1})

// 이게 compound index라고 하는 것이다.
db.contacts.createIndex({"dob.age":1, gender:1})

db.contacts.explain().find({"dob.age": 35, gender:"male"})

db.contacts.explain().find({"dob.age":35})

db.contacts.explain().find({gender:"male"})

db.contacts.explain().find({"dob.age":35}).sort({gender:1})

db.contact.findOne()

// unique 를 이용해서 index를 생성 할 수 있다.
// 하지만 동일한 값이 존재한다면은 이러할 경우 Error가
// 난다는 것을 알면 된다.
db.contacts.createIndex({email:1},{unique:true})

// 이렇게 partialFilterExpression을 쓰면은 dob.age를 index로 사용하되
// 그 Index에는 gender가 male인것만 들어 간다라는 뜻이다.
// insert 될때 gender가 male 인것만 index에 추가 된다라는 그런 말인듯..
// partial index 라고 표현 하기도 한다.
db.contacts.createIndex({"dob.age":1},{partialFilterExpression: {gender:"male"}})

// 이렇게 하면 full scan을 한다. 왜냐하면 gender에 대한 명시를 안해줬기 때문에
// 위에 있는 Index를 우리는 사용 할 수 없다.
db.contacts.explain().find({"dob.age":{$gt:60}})

// 이런식으로 gender를 명시해주면 Index를 이용할 수 있다는 것이지.
// 이렇게 하면 Index의 양이 적어진다. 왜냐면 gender가 female 인것은
// Index에 추가하지 않기 떄문이다. 특정한 상황에 쓰면 좋을듯.
db.contacts.explain().find({"dob.age":{$gt:60},gender:"male"})

// 이런식으로도 사용 가능하다는 것이다.
db.contacts.createIndex({"dob.age":1},{partialFilterExpression: {"dob.age":{$gt:60}}})

db.users.insertMany([{name:"Max",email:"max@test.com"},{name:"Manu"}])

db.users.createIndex({email:1},{unique:true})

// 이렇게 하면은 Error가 난다.
// email Index에서 이미 Manu라는 애가 email 값이 없는 걸로 Ordering 되어있고,
// 위에서 email을 unique로 하였기 때문에, jinsoo 또한 email이 없다.
// 그렇기 때문에 unique에서 오류가 나는 것이다. 값이 없는게 두개 이기 때문에 
// 중복이라고 Mongodb에서는 판단하기 떄문이다.
db.users.insertOne({name:"jinsoo"})

// 그럴 떄는 email이 있는 것만 Index에 추가 하도록 해야 한다는 것이다.
// 뭐 생각하면 당연한 듯 하다. 이런식으로 partial index를 이용하면 된다.
db.users.createIndex({email:1},{unique:true,partialFilterExpression:{email:{$exists:true}}})

db.sessions.insertOne({data:"asfqw",createdAt:new Date()})

// expireAfterSconds 의 의미는 이 이후에 데이터는
// 모두 사라진다는 것을 의미한다.
// date object에만 이 조건을 걸 수 있고, 하나의 field에만
// index를 걸어야 한다 이것을 time-to-live index라고 부른다.
db.sessions.createIndex({createdAt:1},{expireAfterSeconds:10})

// 10초 후에 하면은 데이터가 사라져 있다는 것을 알 수 있다.
// 이는 session에 관련해서 사용하면 꿀이다.
db.sessions.find().pretty()








