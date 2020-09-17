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