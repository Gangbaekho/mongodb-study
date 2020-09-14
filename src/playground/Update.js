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

// 이렇게 하면은 phone이 null로 되겠지만, field 자체를
// 없애고 싶은 우리의 목적은 아니라는 것이다.
db.users.updateMany({isSporty:true},{$set:{phone:null}})

// 이렇게 하면은 phone이라는 field 자체가 없어진다.
db.users.updateMany({isSporty:true},{$unset:{phone:""}})

// field를 rename 하는 방법이다.
db.users.updateMany({},{$rename:{age:"totalAge"}})

// 일부러 없는 Maria를 찾은 것이다. 이렇게 하면은 업데이트 되는 것이 없다.
// 애초에 matchedCount : 0 이기 떄문이다.
db.users.updateOne({name:"Maria"},{$set:{age:29,hobbies:[{title:"Good food",frequency:3}],
isSporty:true}})

// 이렇게 되면은 Maria가 있으면 update 치고 없으면은 insert 치게 되는 것이다.
// 신기한건 name:Maria 까지 insert 된다. 어떻게 보면은 똑똑하게 insert를 한것이다.
// 왜냐면 filter를 그것으로 줬으니까 그 field는 있어야 당연한 것이기 떄문이다.
db.users.updateOne({name:"Maria"},{$set:{age:29,hobbies:[{title:"Good food",frequency:3}],
isSporty:true}},{upsert:true})

db.users.find({hobbies:{$elemMatch:{title:"Sports",frequency:{$gte:2}}}}).pretty()

// hobbies의 document 중 sports이고 2이상인 것을 찾아서 그 hobbies의 document를 저렇게 세팅 하라는 것임.
// 중요한것은 가장 바깥의 document가 아니라 hobbies의 document를 수정하는 차이가 있다는 것이다.
db.users.updateMany({hobbies:{$elemMatch:{title:"Sports",frequency:{$gte:2}}}},{$set:{"hobbies.$.highFrequency":true}})

// 이렇게 하면은 hobbies 중 frequency가 2 이상인 document는 다 뽑힌다.
db.users.find({"hobbies.frequency":{$gt:2}}).pretty().count()

// 이렇게 하면은 hobbies 중 frequency가 2 이상인 document 중, hobbies frequency가 2 이상인 첫번째 
// 어레이 인덱스만 바뀐다. 조건을 만족하더라도 하나만 바뀐다는 것이 문제이다.
// 왜냐하면 $ 은 첫번째만 바꾸기 떄문이다.
db.users.updateMany({"hobbies.frequency":{$gt:2}},{$set:{"hobbies.$.goodFrequency":true}})

// 이렇게 하면은 totalAge가 30 초과인 document 중 hobbies의 Array의 모든 frequency를 -1 한다는
// 그런 의미이다.
db.users.updateMany({totalAge:{$gt:30}},{$inc:{"hobbies.$[].frequency":-1}})

// 이렇게 하면 알다싶이 하나만 만족하더라도 그 document는 뽑히게 된다.
db.users.find({"hobbies.frequency":{$gt:2}}).pretty()

// 첫번째 filter에서는 frequency가 2보다 큰게 하나라도 있으면
// 그 document가 뽑히는 것이고 두번쨰 parameter는 set 해주는 것,
// 세번째 parameter는 el이라고 하는 것을 우리가 명명해주고,
// 그 el은 하나의 hobbies의 document가 된다고 생각하는 것이다.
// 즉 그 중에서 frequency가 2보다 큰것만 바꾼다는 것이다.
db.users.updateMany({"hobbies.frequency":{$gt:2}},
{$set:{"hobbies.$[el].goodFrequency":true}},
{arrayFilters:[{"el.frequency":{$gt:2}}]})

// 이렇게 해버리면은 기존에 있던 elements들은 오버라이딩
// 되기 때문에 우리가 원하는 것이 아니다.
db.users.updateOne({name:"Maria"},{$set:{hobbies:[{title:"test",frequency:3}]}})

// 그럴떈 push라는 operator를 써가지고 추가해 넣는 방식을
// 쓰면은 된다.
db.users.updateOne({name:"Maria"},{$push:{hobbies:{title:"Sports",frequency:2}}})

// 이런식으로 each를 쓰면은 여러개의 Data를 insert 할 수 있다는 것이다.
db.users.updateOne({name:"Maria"},{$push:{hobbies:{$each:[{title:"Good Wine",frequency:1},{title:"Hiking",frqeuency:2}],$sort:{frequency:-1}}}})

// 원하는 array안에다가 일종의 filter를 넣어주면 된다는 것이다.
db.users.updateOne({name:"Maria"},{$pull:{hobbies:{title:"Hiking"}}})

// pop은 하나를 꺼낸다는 그런 의미임으로, 1을 하면은 맨 마지막것을 의미
db.users.updateOne({name:"Chris"},{$pop:{hobbies:1}})

// 맨 앞에것을 의미.
db.users.updateOne({name:"Chris"},{$pop:{hobbies:-1}})

// $push랑 비슷하게 추가를 하는건데 
// 차이점이 있다면 이름에서 보다 싶이 이건 중복된
// 데이터는 저장하지 않는다 라는 그런 특징이 있다.
db.users.updateOne({name:"Maria"},{$addToSet:{hobbies:{title:"Hiking",frequency:2}}})