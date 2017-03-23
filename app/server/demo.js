'use strict'

var array = require('lodash/array')
  , fs = require('fs')

var pics = ['12301001.jpg', '12301002.PNG', '12301004.jpeg', '12301021.gif', '12301127.bmp']
  , database = ['12301001', '12301002', '12301003', '12301004', '12301020', '12301021', '12301125', '12301127']

var dirName = './app/pics/01_刘猛'

fs.readdir(dirName, function(err, files) {
    if (err) { console.log(err) }
    else {
        pics = files
        var studentNumPics = pics.map(getStudentNum)
        var diff = array.difference(database, studentNumPics)
        console.log('current dir:', dirName)
        console.log('pics in current dir:', pics)
        console.log('database:', database)
        if (diff.length) {
            console.log('need:', diff)
            console.log('done:', studentNumPics.length + '/' + database.length)
        }
    }
})

function getStudentNum(picName) {
    var index = picName.indexOf('.')
    if (index) {
        return picName.substring(0, index)
    }
}
