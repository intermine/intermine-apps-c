Document = require '../models/document'

# Keep our results here.
module.exports = new can.Map

    # Total number of matched documents.
    'total': 0

    # The array with top documents. Will init the docs
    #  from localStorage if they are present which is
    #  used when visiting a document detail.
    'docs': new Document.List([ ], yes)