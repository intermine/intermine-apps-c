fs = require 'fs',
xml2js = require 'xml2js'
_ = require 'lodash'

extract = (doc) ->
    doc = doc.MedlineCitation[0]

    'pmid': doc.PMID[0]._
    'journal': doc.Article[0].Journal[0].Title[0]
    'issue': do ->
        item = doc.Article[0].Journal[0].JournalIssue[0]
        'volume': item.Volume?[0]
        'issue': item.Issue?[0]
        'published': do ->
            date = item.PubDate[0]
            'year': date.Year?[0]
            'month': date.Month?[0]
            'day': date.Day?[0]
    'title': doc.Article[0].ArticleTitle[0]
    'abstract': doc.Article[0].Abstract?[0].AbstractText[0]._
    'authors': _.map doc.Article[0].AuthorList?[0].Author, (item) ->
        obj = {}
        for key, value of item
            obj[key.toLowerCase()] = value[0]
        obj
    'keywords': _.flatten _.map doc.KeywordList, (item) ->
        _.map item.Keyword, '_'

parser = new xml2js.Parser()
fs.readFile __dirname + '/example/cancer.xml', (err, data) ->
    parser.parseString data, (err, result) ->
        docs = _.map result.PubmedArticleSet.PubmedArticle, extract
        string = JSON.stringify docs, null, 4

        fs.writeFile __dirname + '/example/cancer.json', string, (err) ->
            console.log 'Done'