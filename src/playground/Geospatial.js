
// GeoJSON이라는 개념이 나오게 되는데
// location을 보다 싶이 type이랑 coordinates는 반드시 있어야 하는 field이다.
// coordinates에서 첫번째는 longitude를 의미하고, 두번째는 latitude를 의미한다.
// 참고로 이러한 정보는 구글맵에서 특정 포인트를 찍으면 url에 정보가 나오는데
// url에서 첫번째까 latitude이고 두번쨰가 longitude라는 것 알아두면 쓸모 있을듯 하다
db.places.insertOne({name:"California Academy of Sciences", location:{type:"Point",cordinates:[-122.4682834,37.7698688]}})

