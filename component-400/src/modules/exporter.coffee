saveAs = require 'filesaver'

module.exports = ->
    blob = new Blob ["Hello, world!"], { 'type': "text/plain;charset=utf-8" }
    saveAs blob, 'hello.txt'