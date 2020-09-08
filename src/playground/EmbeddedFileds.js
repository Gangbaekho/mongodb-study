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