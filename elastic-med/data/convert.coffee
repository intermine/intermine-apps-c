fs = require 'fs',
xml2js = require 'xml2js'
_ = require 'lodash'

extract = (doc) ->
    med = doc.MedlineCitation[0]
    ids = doc.PubmedData[0].ArticleIdList[0].ArticleId

    'id': _.zipObject _.map ids, (id) ->
        [ id.$.IdType, id._ ]
    'journal': med.Article[0].Journal[0].Title[0]
    'issue': do ->
        item = med.Article[0].Journal[0].JournalIssue[0]
        'volume': item.Volume?[0]
        'issue': item.Issue?[0]
        'published': do ->
            date = item.PubDate[0]
            'year': date.Year?[0]
            'month': date.Month?[0]
            'day': date.Day?[0]
    'title': med.Article[0].ArticleTitle[0]
    'abstract': med.Article[0].Abstract?[0].AbstractText[0]._
    'authors': _.map med.Article[0].AuthorList?[0].Author, (item) ->
        obj = {}
        for key, value of item
            obj[key.toLowerCase()] = value[0]
        obj
    'keywords': _.flatten _.map med.KeywordList, (item) ->
        _.map item.Keyword, '_'

parser = new xml2js.Parser()
fs.readFile __dirname + '/cancer.xml', (err, data) ->
    parser.parseString data, (err, result) ->
        docs = _.map result.PubmedArticleSet.PubmedArticle, extract
        string = JSON.stringify docs, null, 4

        fs.writeFile __dirname + '/cancer.json', string, (err) ->
            console.log 'Done'