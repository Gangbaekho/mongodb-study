
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

