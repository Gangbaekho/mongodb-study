
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