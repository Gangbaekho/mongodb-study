db.movies.findOne()

db.movies.find().pretty()

db.movies.find({name:'The Last Ship'})

db.movies.find({runtime:60})

db.movies.findOne({runtime:60})


// 밑에 두개는 서로 같다. 그냥 밑에꺼를 써도 되겠다.
db.movies.find({runtime:{$eq:60}})

db.movies.find({runtime:60})

// ne는 not equal의 줄임말이다.
db.movies.find({runtime:{$ne:60}})

//lt lower than <
db.movies.find({runtime:{$lt:40}})

//lte lower than equal <=
db.movies.find({runtime:{$lte:42}})

//gte greater than equal >=
db.movies.find({runtime:{$gte:42}})



