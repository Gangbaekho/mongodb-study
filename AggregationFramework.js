
// 일단 find 대신 aggregate를 사용하고 있는건데
// 기본적으로 aggregate라고 해서 모든 document를
// fetch 하지는 않는다는 것이다.
// [] 안에는 step들이 들어가는 것이다.
// $match 라는 것은 filtering step이며, match 안에는
// find()에서 했던것처럼 filter가 들어가면 된다.
db.persons.aggregate([
    {$match:{gender:"male"}}
])