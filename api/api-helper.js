const db = require('../data/dbConfig');

module.exports = {
    getAllData,
    add,
    findByUsername,
    getMatchingDepartments
}

function getAllData() {
    return db('login').select('id', 'username', 'department');
}

function getMatchingDepartments() {
    return db('login').select('id', 'username', 'department');
}

function add(data) {
    return db('login')
    .insert(data);
}

function findByUsername(username) {
    return db('login').where({username}).first();
}

//done 