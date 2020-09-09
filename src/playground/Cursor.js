
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
 


