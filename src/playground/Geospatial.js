
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

// 지금부터 해볼 것은 어떠한 지역(Polygon)안에 있는 Points들을 찾는 것이다.
// 아래의 coordinates가 특정 Polygon을 형성한다고 생각하면 된다.
// 우리가 추가했던 지역중 Nopa 뺴고는 모두 이 Polygon 안에 존재한다.
const p1 = [-122.4547,37.77473]
const p2 = [-122.45303,37.76641]
const p3 = [-122.51026,37.76411]
const p4 = [-122.51088,37.77131]

// 이렇게 해주면 결과값이 잘 나온다.
// coordinages 에서 p1은 두번 나온다. end point를 알기 위해서임.
db.places.find({location:{$geoWithin:{$geometry:{type:"Polygon",coordinates:[[p1,p2,p3,p4,p1]]}}}}).pretty()

// 이제 유저가 특정 구역이 있는걸 확인하는것을 해보자
// 일단 폴리곤을 등록해주자.
db.areas.insertOne({name:"Golden Gate Part",area:{type:"Polygon",coordinates:[[p1,p2,p3,p4,p1]]}})

db.areas.createIndex({area:"2dsphere"})

// geoIntersects는 특정 point를 포함하고 있는 지역을 리턴하는거고
// geoWithin은 특정 지역안에 있는 point들을 리턴하는 것이다. 
// 차이점을 잘 알아두도록 한다.
db.areas.find({area:{$geoIntersects:{$geometry:{type:"Point",coordinates:[-122.49089,37.76992]}}}})