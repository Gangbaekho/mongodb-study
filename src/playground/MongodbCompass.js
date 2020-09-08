db.persons.insertOne({
    name:'Max',
    age: 30,
    hobbies : ["Sports","Cokking"]
})

db.persons.insertOne({
    name:"Manuel",
    age:31,
    hobbies:["Cars","Cooking"]
})

db.persons.insertMany([
    {
        name:"Anna",
        age:29,
        hobbies:["Sports","Yoga"]
    }
])

db.persons.insertMany([{
    name:"Maria",
    age:31
},{
    name:"Chris",
    age:32

}])

db.persons.insert({name:"Phil",age:35})
db.persons.insert([{
 name:"Sanddep",
 age:28   
},{
    name:"Hans",
    age:38
}])