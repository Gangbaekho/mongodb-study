
// 이렇게 내딴에는 정수를 저장한다고 하더라도
// MongoShell은 Javscript를 inherit 하기 때문에
// 64 bits double로 저장 된다는 사실을 알아야 한다
// 하지만 Java Driver를 쓴다면은 내가 원하는 타입으로
// 저장해줄 꺼니까 특별히 걱정할 일은 아니다.
db.numtest.insertOne({a:1})

// 뭐 이렇게 하면은 용량을 줄일 수 있다는 거다.
// db.persons.stat() 을 하면은 세부 내용을 볼 수 있다는 것 정도.
db.persons.insertOne({name:"Max",age:NumberInt(29)})

// 20억이 넘는 것을 32 bits Integer에 넣어봤다니
// Overflow 되서 이상한 숫자가 튀어나온다.
db.companies.insertOne({valuation:NumberInt("5000000000")})

// 이렇게 하면 double 로 들어가니까 괜찮다.
db.companies.insertOne({valuation:5000000000})

// 근데 확실히 정수로 쓸 것으로 정했으면
// 이렇게 Long으로 바꿔주는것이 바람직 하지 않을까
// 아무튼 range를 적당히 알아두고 타입을 정하는게 좋다는 것이다.
db.companies.insertOne({valuation:NumberLong("5000000000")})

// NumberDecimal을 사용하지 않으면 딱 0.2가 나오지 않는데,
// 이걸 사용하면은 소수점 34 자리까지 명확하게 계산 할 수 있다는 것이다.
db.science.insertOne({a:NumberDecimal("0.3"),b:NumberDecimal("0.1")})
db.science.aggregate([{$project:{result:{$subtract:["$a","$b"]}}}])