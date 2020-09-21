
// 일단 find 대신 aggregate를 사용하고 있는건데
// 기본적으로 aggregate라고 해서 모든 document를
// fetch 하지는 않는다는 것이다.
// [] 안에는 step들이 들어가는 것이다.
// $match 라는 것은 filtering step이며, match 안에는
// find()에서 했던것처럼 filter가 들어가면 된다.
db.persons.aggregate([
    {$match:{gender:"male"}}
])

// 남자 중에 location.state 를 기준으로 grouping 하고
// totalPersons 이란 field에 총 사람 수를 표현 하라는 것임.
// sql의 group by와 비슷한 개념이긴 하다
// $sum 이란 것은 한 document 마다 1을 올리라는 단순한 것이다.
// 여기서는 count의 의미가 되겠다.
db.persons.aggregate([
    {$match:{gender:"male"}},
    {$group:{_id:{state:"$location.state"},totalPersons:{$sum:1}}}
])

// sort는 이전에 한거랑 비슷한데,
// 원래 document에는 없는 totalPersons를 정렬 기준으로 삼았다.
// 이렇게 할 수 있는 이유는 각각의 step은 그 전 step의 리턴값을
// 받아서 하기 때문에 가능했던 것이다.
db.persons.aggregate([
    {$match:{gender:"male"}},
    {$group:{_id:{state:"$location.state"},totalPersons:{$sum:1}}},
    {$sort:{totalPersons: -1}}
])

// $는 이게 단순한 String이 아니라 nested document 에서
// 사용되는 것이라고 알려주는 것이다.
// aggregate 의 project가 일반 find method에서 쓰는 것과 다른것은
// 아래와 같이 원래 document에 없는 field를 특정 값들의 조합으로
// 만들 수 있다 라는 것이다. 이건 aggregate framework에서만 가능하다는 것이다.
db.persons.aggregate([
    {$project:{_id:0,gender:1, fullName:{$concat:["$name.first"," ","$name.last"]}}}
])

// 이런식으로 기존에 있는 값을 조작한다음에 가져올 수 도 있다는 것이다.
// 중요한 것은 대문자로 바꾸는 것이 아니라 조작 할 수 있다는 것이다.
db.persons.aggregate([
    {$project:{_id:0,gender:1, fullName:{$concat:[{$toUpper:"$name.first"}," ",{$toUpper:"$name.last"}]}}}
])


// person에 기본적으로 들어 있는 location은 GeoJSON 형태에
// 맞춰져 있지 않은 상태이다. 그러니까 이것을 project를 통해서
// geojson 형태로 맞추는 것이 이 쿼리의 목적이라고 생각하면 된다.
// 신기한것은 type : Point라고 되어 있는데 이렇게 하드 코딩으로
// 원하는 것을 써주면은 그게 나타난다라는 것이다(숫자대신에)
// 그리고 convert라는 것을 사용해 줬다는 것 정도 생각해주면 된다.
// Error가 날시, Null 일시를 대비하여 처리 해줬다는 것도 볼만한 사항이다
db.persons.aggregate([
    {$project:{_id:0,name:1, email:1,location:{ type : "Point", coordinates:[
        {$convert:{ input:"$location.coordinates.longitude", to:"double", onError:0.0, onNull:0.0}},{$convert:{ input:"$location.coordinates.latitude", to:"double", onError:0.0, onNull:0.0}}
    ]}}}
])

// 이것 또한 마찬가지로 date 데이터를 특정 년도로 바꿔서 
// 그룹핑 하는 거에 지나지 않는다
// $isoWeekYear 만 챙겨가면 된다
// 그리고 또 하나, projection 된거 가지고
// group을 지을 수 있다는 것을 이해하면 된다.
db.persons.aggregate([
    {$project : 
        {
            _id:0, 
            name :1, 
            email:1, 
            birthdate:{$toDate:"$dob.date"},
            age : "$dob.age"
        }
    },
    {$group : {_id:{birthYear:{$isoWeekYear:"$birthdate"}},numPersons:{$sum:1}}}
])

// group이라는 것 자체가 n:1 즉,
// 여러개의 document가 하나의 document가 되는 것을 의미하니까..
// 각각 document에 있는 array를 하나의 array로 표현 해야 할 떄가 있을 것이다.
// 일단 이렇게 되면은 합쳐지긴 하는데, [[],[]] 이런식으로
// array안에 array가 생성된다는게 문제, ["","","",""] 이렇게 하고 싶은데 말이다.
db.friends.aggregate([
    {$group : {_id:{age:"$age"}, allhobbies:{$push:"$hobbies"}}}
])

// 이렇게 unwind만 따로 해서 실험을 해보면은 결과는 참 희한한데,
// 일단은 unwind라는 것은 array의 field에 적용 할 수 있다는 것을 알아두고,
// Max라는 애는 hobbies가 두개이다.
// 결과는 hobbies[0] 의 것과 나머지는 그대로, hobbies[1] 의 것과 나머지는 그대로
// 이렇게 Max의 document가 두개로 분리 된다는 것이다. 엄청나게 중복된 데이터가
// 생기게 되는것이지.
db.friends.aggregate([
    {$unwind:"$hobbies"}
])

// 그러니까 이렇게 했을때 위에서 직면한 문제를
// 해결 할 수 있는 역할을 할 수 있다는 건데
// 너무 데이터 중복되게 하는거 아닌가 싶다.
// 근데 이렇게 되면은 hobbies 안에 중복된 value가 생긴다는
// 문제점이 발생하게 된다.
db.friends.aggregate([
    {$unwind:"$hobbies"},
    {$group : {_id:{age:"$age"}, allhobbies:{$push:"$hobbies"}}}
])


// 중복되는게 걱정이라면 그냥 아래와 같이
// addToSet을 써주면 끝.
db.friends.aggregate([
    {$unwind:"$hobbies"},
    {$group : {_id:{age:"$age"}, allhobbies:{$addToSet:"$hobbies"}}}
])

// friends에는 exameScores가 있는데 [{},{}] 이런 모양임.
// $slice의 첫번째는 array를 집어넣으면 되고, 두번째는
// 시작점 부터 몇개의 요소를 가져올 것인지를 의미한다.
db.friends.aggregate([
    {$project:{
        _id:0,
        examScore:{$slice:["$examScores",1]}
    }}
])

// 이렇게 하면 뒤에서 한개를 의미한다.
db.friends.aggregate([
    {$project:{
        _id:0,
        examScore:{$slice:["$examScores",-1]}
    }}
])

// index 2에서 부터 1개를 가져오라는 말임.
db.friends.aggregate([
    {$project:{
        _id:0,
        examScore:{$slice:["$examScores",2,1]}
    }}
])