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