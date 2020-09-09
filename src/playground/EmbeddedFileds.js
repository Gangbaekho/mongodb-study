//Embedded query
db.movies.find({"rating.average":{$gt:7}}).pretty()

// 이렇게 한다고 Drama 딱 한개만 있는것을 찾는 것은 아니다.
// Drama를 포함하고 있는 것을 return 한다는 것을 알아두자.
// 즉 include를 뜻하는 거다.
db.movies.find({genres:"Drama"})

// 하지만 이렇게 array를 통해서 정의를 해주면은
// Drama 하나만 있는것을 찾게 된다.
db.movies.find({genres:["Drama"]})

// array 안에 있는것만 찾는다.
db.movies.find({runtime:{$in:[30,42]}}).pretty() 

// array 안에 없는것만 찾는다.
db.movies.find({runtime:{$nin:[30,42]}}).pretty()

// $or:[] array안에다가 여러가지 filter를 넣어주면 된다는 것이다.
db.movies.find({$or:[{"rating.average":{$lt:5}},{"rating.average":{$gt:9.3}}]}).pretty()

// 5보다 작지 안거나 9.3보다 크지 않거나.
db.movies.find({$nor:[{"rating.average":{$lt:5}},{"rating.average":{$gt:9.3}}]}).pretty()

// 두개는 동일하니까 간단한 밑에껄로 하자.
db.movies.find({$and:[{"rating.average":{$gt:9}},{genres:"Drama"}]}).count()
db.movies.find({"rating.average":{$gt:9},genres:"Drama"}).count()

// 두 개의 결과는 다르다. 그러니까 즉, 같은 field에서 조건을 걸떄는 and를 써야 할 떄도 있다는 것이다.
// 위에있는 것은 Drama Horror 둘 중 하나만 있는것을 찾는거고
// 밑에 있는 것은 사실 Horror가 있는 것을 찾는다. 왜냐면 Overried 되기 때문에 앞에 조건은 무시가 되기 떄문이다.
db.movies.find({genres:"Drama",genres:"Horror"}).count()
db.movies.find({$and:[{genres:"Drama"},{genres:"Horror"}]}).count()

// 이걸 해보면은 not이 먹히는지 안먹히는지 알 수 없다.
db.movies.find({runtime:{$not:{$eq:60}}}).count()
db.movies.find({runtime:60}).count()
db.movies.find().count()

// 하지만 $not은 자주 쓰는 operator는 아니다.
// 아래의 두개는 동일한 것이기 때문에 위에것을 선호한다.
db.movies.find({runtime:{$ne:60}}).count()
db.movies.find({runtime:{$not:{$eq:60}}}).count()

// Diving into Element operators
db.users.insertMany([
    {
        name:"Max",
        hobbies:[{title:"Sports",frequency:3},{title:"Cooking",frequency:6}],
        phone:1234124
    },
    {
        name:"Manuel",
        hobbies:[{title:"Cooking",frequency:5},{title:"Cars",frequency:2}],
        phone:"01824124",
        age:30
    }
])

// find users who has phone field.
db.users.find({age:{$exists:true}}).pretty()
db.users.find({age:{$exists:true,$gt:30}}).pretty()

db.users.insertOne({name:"Anna",hobbies:[{title:"Sports",frequency:2},{title:"Yoga",frequency:3}],
phone:"124812512",age:null})

db.users.find().pretty()
db.users.find({age:{$exists:true}}).pretty()

db.users.find({age:{$exists:false}}).pretty()
db.users.find({age:{$exists:true,$ne:null}}).pretty()

// $type operator
db.users.find({phone:{$type:"string"}}).pretty()
db.users.find({phone:{$type:"number"}}).pretty()

// Integer로 저장한다고 해도 javascript는 double로 인지한다?
// 이건 나중에 다시 알아보도록 하자.
db.users.find({phone:{$type:"double"}}).pretty()

// 이렇게 array로 지정할 수도 있다. 둘 중 하나만 속해도 return 함.
db.users.find({phone:{$type:["double","string"]}}).pretty()

// $regex(regular-expressions)
// regular expression은 꽤나 복잡한데 여기에서는 summary라는 text 안에 musical이
// 있는 애를 찾아보도록 한다.
// 특정 문자열을 찾는데는 좋을 수 있으나, 효율적이지 않다는 문제점이 있다.
db.movies.find({summary:{$regex:/musical/}}).pretty()

// $expr(expression?)
db.sales.insertMany([{volume:100,target:120},{volume:89,target:80},{volume:200,target:177}])

// volume > target 을 찾는 것임.
db.sales.find({$expr:{$gt:["$volume","$target"]}}).pretty()


db.sales.find({$expr:{$gt:[{$cond:{if:{$gte:["$volume",190]},then:{substract:["$volume",10]},else:"volume"}}, "$target"]}}).pretty()

// 이렇게 하면은 hobbies array에 해당 document가 존재하면은 그게 출력이 된다.
// 하지만 frequency 까지 하고 싶은게 아니라 Sports만 있는 것들을 찾고 싶으면 어떻게 해야 할까?
// 결과는 2개
db.users.find({hobbies:{title:"Sports",frequency:2}}).pretty()

// 비록 hobbies는 array라서 직접 title을 가지고 있는 형태는 아니지만,
// 아래와 같은 쿼리를 작성 할 수 있다는 것이다.
// 결과는 3개로 나왔음을 확인 할 수 있다.

// 즉, 정리하자면 hobbies가 array를 가지고 있어도 title에 이렇게 접근 가능하다는 것을 알면 된다.
db.users.find({"hobbies.title": "Sports"}).pretty()

db.users.insertOne({
    name:"Chris",
    hobbies:["Sports","Cooking","Hiking"]
})

// 이런식으로 size의 숫자를 직접 정해줄 수 있다.
// 하지만 한가지 유의해야 할 점은 size > 2 이런식으로 
// 쓰는 것은 불가능 하다. 꼭 정확한 숫자로 정해져야 한다는 것이다.
db.users.find({hobbies:{$size:3}}).pretty()

db.moviestart.insertMany([
    {
        name:"Titanic",
        genre:[
            "action",
            "thriller"
        ]
    },
    {
        name:"Juon",
        genre:[
            "action",
            "thriller",
            "horror"
        ]
    }
])

db.moviestart.insertOne({
    name:"Inception",
    genre:[
        "thriller",
        "action"
    ]
})

// 이렇게 하면은 genre가 action, thriller 순서에 맞게 있는 것만 
// 뽑아내게 된다는 것이다. 하지만 순서는 상관 없다고 할때는
// 어떤 쿼리를 작성해야 할까
db.moviestarts.find({genre:["action","thriller"]}).pretty()

// 이렇게 하면은 genre에 action과 thriller가 포함된 모든 것을 
// 찾게 된다. 물론 action, thriller 가 있고 추가로 다른 것도 있는
// 것도 같이 뽑힌다.
db.moviesstars.find({genre:{$all:["action","thriller"]}}).pretty()