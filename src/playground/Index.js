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

db.customers.insertManu([{name:"Max",age:29,salary:3000},{name:"Many",age:30,salary:4000}])

db.customers.createIndex({name:1})

// 이렇게 하면은 executionStats안에 있는 totalDocsExamined가 1이 된다.
// 이 말은 즉, pointer를 통해서 name이 Max인 document에 접근을 했다는 소리이다.
// 여기서 포인트로 집고자 하는 것은 Index는 단순히 포인터 기능만 있는게 아니다.
// name으로 Index를 만들었기 때문에 Index는 name이라는 value 또한 가지고 있는 것이다.
db.customers.explain("executionStats").find({name:"Max"})

// 이렇게 쿼리를 작성해주면은 결국 원하는건 name이기 떄문에
// Index 만으로도 그 결과를 찾을 수 있기 때문에 즉, document를
// pointer를 통해서 뒤지지 않아도 된다는 소리이고 그렇기 때문에
// totalDocsExamined가 0이 된다라는 그런 말이다
// Index에서 cover 할 수 있기 떄문에 covered query라고 하는 것이다.
db.customers.explain("executionStats").find({name:"Max"},{_id:0,name:1})

// compound index를 만들떄는 순서가 중요하다는 것을 인지해야 한다.
// 만약 name이 먼저 들어갔다고 하면, 위에서 만든 single index인
// name으로 만든 index는 의미가 없다는 것이다. 이걸로 대체 할 수 있으니까.
db.customers.createIndex({age:1,name:1})

// 이러한 쿼리를 날릴떄, 위에서 적용한 Index를 이용해서
// 찾을것은 맞는데, 여기서 이해해야 하는 것은 
// Rejects a plan이다. find 조건에 name라는 것이 있으니까
// 앞서 만든 single name index를 사용할 수 도 있는 것인데
// 더 적절한 Index를 mongodb가 알아서 사용하기 때문에
// 그 Index는 reject 되었다는 그런 얘기이다.
db.customers.explain().find({name:"Max",age:30})

db.contacts.insertOne({name:"Max",hobbies:["Cooking","Sports"],
addresses:[{street:"Main Street"},{street:"Second Street"}]})

// 이전과 다른점은 Index에 단일 값이 아닌
// array를 걸었다는 것인데 mongodb에서는 이게 가능하다.
// 하지만 array가 아닌 index에 비해서는 많은 데이터를 Index에
// 저장해야 하는 단점이 있긴 하지만, 그렇다고 쓰면 안되는 것은 아니다.
// 이런것을 multi-key index 라고 부른다.
db.contacts.createIndex({hobbies:1})

db.contacts.explain().find({hobbies:"Sports"})

db.contacts.createIndex({addresses:1})

// 이렇게 하면 full scan을 한다 예상하다 싶이
// index로 document를 가지고 있는 것이지 document의 street로
// ordering 한게 아니기 떄문이다.
db.contacts.explain().find({"addresses.street":"Main Street"})

// 이렇게 하면은 IXSCAN 이 된다는 것이다.
db.contacts.explain().find({address:{street:"Main Street"}})

// 이렇게 하면은 아까 했던 것을 IXSCAN으로 할 수 있다는거고
// 이것 또한 multi-key index라는 것을 알아두면 된다.
db.contacts.createIndex({"addresses.street":1})

// 이런식으로 single-key와 multi-key를 합쳐서
// compound index를 만들어도 상관없다.
db.contacts.createIndex({name:1,addresses:1})

// 하지만 이런식으로 multi-key + multi-key 는 
// Error가 난다는 것 까지 알아두면 된다.
db.contacts.createIndex({hobbies:1,addresses:1})

db.products.insertMany([{title:"A Book", description:"This is an awesome book about a young artist!"},{title:"Red T-Shirt",description:"This T-Shirt is red and it's pretty awesome!"}])

// 보통은 -1 이나 1을 써가지고 order by 를 표현하지만,
// text index에서는 그렇게 하면 안된다. text index를 쓸 것이라면 말이다.
// text index는 text를 array 형태로 저장을 하게 되는데 is , a 와같은
// 매우 평범한 것은 array에 저장하지 않는다. 왜냐면 그것을 기준으로
// 찾을 일은 없다고 판단하기 때문이다. 즉, keyword 만 저장하게 된다.
db.products.createIndex({description:"text"})

// 보통은 text를 찾는다 하더라도 특정 field에 있는 
// text를 찾는다고 생각하겠지만, 그렇지 않다 어짜피
// text index는 하나 일 것이기 때문이다.
// 대문자 소문자는 중요하지 않다 어짜피 Lowercase로 저장하기 때문.
// 위에 insertMany를 기준으로 하면 두개가 검색 될 것이다.
db.products.find({$text:{$search:"awesome"}}).pretty()

// 이렇게 하면 키워드 두개 중 하나만 만족해도 나오기 때문에
// 이것도 결국 두개가 나오게 된다.
db.products.find({$text:{$search:"red book"}}).pretty()

// 이렇게 하면은 red book 이라는 문장이 있는 것을 찾게 된다.
// 즉, "을 추가 해줘야 하는데 javascript에서는 저렇게 처리해야 한다.
db.products.find({$text:{$search:"\"red book\""}}).pretty()

// 이것을 하면 두개의 document가 나온다.
// 주목해야 할 것은 하나는 두개중 하나만 포함되어있고
// 다른 하나는 두개다 포함되어있다. 이러한 상황에서
// 제일 매칭이 잘되는 것은 두번째일 것이고 상황에따라
// 매칭 포인트가 가장 높은 순으로 정렬하고 싶을 것이다.
db.products.find({$test:{$search:"awesome t-shirt"}}).pretty()

// 그럴때는 1차적으로 이렇게 projection을 통해서
// score라는 field를 검색 결과에 포함시켜줘야 한다.
// 그러면은 매칭된 keyword를 기준으로 점수가 포함된다.
db.products.find({$text:{$search:"awesome t-shirt"}},{score:{$meta:"textScore"}}).pretty()

// 이렇게 정렬을 해주면은 매칭이 잘된 document로 정렬 할 수 있다.
db.products.find({$text:{$search:"awesome t-shirt"}},{score:{$meta:"textScore"}}).sort({score:{$meta:"textScore"}}).pretty()

// 일단 이렇게 text index를 추가하려면
// 에러가 난다. 기존에 있단 text index와 머지를
// 시도하지만 실패한다는 뭐 그런 얘기임.
db.products.createIndex({title:"text"})

// 이렇게 일단은 기존에 있던 index를 지워준다.
// 이름이 살짝 다를 수 있는데 getIndexes()를 이용해서
// 인덱스 이름을 찾아주면 된다.
db.products.dropIndex("description_text")

// 이렇게 해주면은 하나의 text index가 title과 description의
// 키워드를 모두 관리하게 된다는 그런 의미임.
db.products.createIndex({title:"text",description:"text"})

// 이걸 추가해서 실험해보자
db.products.insertOne({titke:"A Ship",description:"Floats perfectly"})

db.products.find({$text:{$search:"ship"}})

// 이걸 하게 되면 두개의 document가 return 된다.
// 근데 두개 중 t-shirt가 포함되어 있는 document 를 빼고 싶다고 한다면?
db.products.find({$text:{$search:"awesome"}}).pretty()

// 이렇게 포함되지 않아야 할 단어에 -를 붙인다음에
// 해당하는 단어를 적어주면은 그것을 제외한단 그런 의미임.
db.products.find({$text:{$search:"awesome -t-shirt"}}).pretty()

 