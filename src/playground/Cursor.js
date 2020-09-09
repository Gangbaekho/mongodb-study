
// find()의 return 값은 cursor이기 떄문에
// 다음과 같이 next()라는 것을 부르면 그 다음 document가 나온다라는 의미이다.
const dataCursor = db.movies.find()
dataCursor.next()

// 이렇게 하면은 240개가 다 나오네..
// 이렇게 해서 뭔가 필터링 할 수도 있겠지만
// 이렇게 하는 것은 client side에서만 해야 한다.
dataCursor.forEach((doc)=>{
    printjson(doc)
})

// 다음 document가 있는지 없는지 확인 할 수 있다.
dataCursor.hasNext()

// 1은 ASC를 의미하고 -1은 DESC을 의미한다.
// 그리고 sort()는 항상 find() 다음에 온다는 것을 기억해야 한다.
db.movies.find().sort({"rating.average":1}).pretty()
db.movies.find().sort({"rating.average":-1}).pretty()

// 이렇게 하면 order by 를 여러개로 줄 수 있다는 것이다.
db.movies.find().sort({"rating.average":1,runtime:-1}).pretty()

// 앞에 100개는 생략하고 result를 던져준다는 얘기임
db.movies.find().sort({"rating.average":1, runtime:-1}).skip(100).count()

// 100개를 생략하고 그 다음 10개만 추려낸다는 것임.
// 이렇게 하면은 pagenation을 할때 offset과 limit
// 의 의미와 같다는 것을 알 수 있다. 그런식으로 사용하면 됨.
db.movies.find().sort({"rating.average":1, runtime:-1}).skip(100).limit(10)

// 이건 그냥 팁인데, 굳이 순서를 맞추지 않아도 
// mongoserver 에서는 sort먼저하고 skip 하고 limit을 수행한다.
db.movies.find().skip(100).limit(10).sort({"rating.average":1, runtime:-1})

// projection에 대해서 알아볼건데, 알다싶이 movie 데이터는 좀 heavy하다
// movie 데이터에 있는 모든 field 가 필요하지 않다면 애초부터 필요한
// 데이터만 필터링해서 주는것이 바람직 할 텐데, 이것이 바로 projection 이라고 할 수 있다.
// find의 첫번째 파라미터에 조건을 주고, 두번째 파라미터에 원하는 field를 1로 표시하면 되는데,
// 한가지 예외로, _id 값은 default가 1이기 때문에 필요없다면 0으로 처리하면 된다.
db.movies.find({},{name:1,genres:1,runtime:1,rating:1}).pretty() 
db.movies.find({},{name:1,genres:1,runtime:1,rating:1,_id:0}).pretty()

// embedded document 라 하더라도 원하는 값만 뽑아낼 수 있다.
db.movies.find({},{name:1,genres:1,runtime:1,"rating.average":1,_id:0}).pretty()

// 앞에 조건에 속하는 document 중 genres array에서는 두개만 꺼내오고
// 이름과 함께 projection 한다라는 그런 의미이다.
// 뭐 slice가 자른다는 그런 의미니까 array에서 쓴다 정도만 기억하면 될듯.
db.movies.find({"rating.average":{$gt:9}},{genres:{$slice:2},name:1}).pretty()

// 이건 genres array에서 첫번째꺼를 뺴고 2개를 가져온다는 의미임.
db.movies.find({"rating.average":{$gt:9}},{genres:{$slice:[1,2]},name:1}).pretty()
