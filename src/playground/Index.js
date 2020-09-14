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