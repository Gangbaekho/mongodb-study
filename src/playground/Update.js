// {$set:{}} set 안에는 document가 들어간다고 생각하면 된다.
// 이것은 오버라이드 하는 특징이 있다는 것도 알아둬야 한다.
db.users.updateOne({_id:ObjectId("5f584d0ad1736122b238c313")},{$set:{hobbies:[{title:"Sports",frequency:5},{title:"Cooking",frequency:3},{title:"Hiking",frequency:1}]}})

// 이 결과로는 matchedCount 와 modifiedCount 라는 것이 있는데,
// matchedCount는 filter로 찾은 갯수를 의미하는 거고 modifiedCount는 변화된 것을 의미한다.
// 그런데 변화된게 없으면은 Mongodb에서는 해당 쿼리를 무시하는 것도 알아두자.

db.users.find({"hobbies.title":"Sports"}).pretty()

db.users.updateMany({"hobbies.title":"Sports"},{$set:{isSporty:true}})

// 이번꺼는 여러개의 field를 바꾸는 건데, set 안에 document가 들어간다고 생각하면은
// 뭐 특이한 사항은 아닌것 같다.
db.users.updateOne({_id:ObjectId("5f584d0ad1736122b238c313")},{$set:{age: 40, phone:125125812}})

// age를 2만큼 올리라는 그런 의미이다.
db.users.updateOne({name:"Manuel"},{$inc:{age:2}})

// 이렇게 하면 마이너스가 되겠찌
db.users.updateOne({name:"Manuel"},{$inc:{age:-1}})

// 이런식으로 하면 age를 -1하고 다른 field를 update 할 수 도 있다는 것이다.
db.users.updateOne({name:"Manuel"},{$inc:{age:-1},$set:{isSporty:false}})

