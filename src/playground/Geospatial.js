
// GeoJSON이라는 개념이 나오게 되는데
// location을 보다 싶이 type이랑 coordinates는 반드시 있어야 하는 field이다.
// coordinates에서 첫번째는 longitude를 의미하고, 두번째는 latitude를 의미한다.
// 참고로 이러한 정보는 구글맵에서 특정 포인트를 찍으면 url에 정보가 나오는데
// url에서 첫번째까 latitude이고 두번쨰가 longitude라는 것 알아두면 쓸모 있을듯 하다
db.places.insertOne({name:"California Academy of Sciences", location:{type:"Point",coordinates:[-122.4682834,37.7698688]}})

// 현재 내 위치에서 가까운 places 를 찾는 쿼리를 작성해본다.
// 조건 안에 들어가 있는 coordinates 가 유저의 위치를 나타내겠지.
// 이걸 run 하게 되면은 near에 geospatial index가 없다는 에러가 나온다.
db.places.find({location:{$near:{$geometry:{type:"Point",coordinates:[-122.471114,37.771104]}}}})

// 이렇게 하면은 location field에 geospatial index가 생긴다 라는 것이다.
db.places.createIndex({location:"2dsphere"})

// 그리고 다시 돌리면은 정상적으로 가까운 place가 나온다
// 처음에 insert한 California Academy of Sicenes 실제로 가까운 곳이기 떄문.
// 근데 near 하다 라는건 기본적으로 주관적이기 때문에 그 near의 기준을
// 정해줄 필요가 있다라는 거지.
db.places.find({location:{$near:{$geometry:{type:"Point",coordinates:[-122.471114,37.771104]}}}})

// 이렇게 maxDistance와 minDistance를 정의해주면은 
// near의 기준을 정할 수 있다라는 것임
// distance의 기준은 meter 이다.
db.places.find({location:{$near:{$geometry:{type:"Point",coordinates:[-122.471114,37.771104]},$maxDistance:500, $minDistance:10}}})

// 새로운 지역을 추가해주자.
db.places.insertOne({name:"Conservatory of Flowers", location:{type:"Point",coordinates:[-122.4615748,37.7701756]}})
db.places.insertOne({name:"Golden Gate Part Tennis Courts", location:{type:"Point",coordinates:[-122.593702,37.7705046]}})
db.places.insertOne({name:"Nopa", location:{type:"Point",coordinates:[-122.4389058,37.7747415]}})