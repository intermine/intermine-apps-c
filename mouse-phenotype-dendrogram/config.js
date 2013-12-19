// Will be converted to plain JS Object.
module.exports = {
    "author": "Radek <rs676@cam.ac.uk>",
    "title": "Mouse Phenotype Dendrogram Clustering",
    "description": "Replaces a tag cloud of phenotypes associated with alleles and their scores",
    "version": "0.3.4",
    "dependencies": {
        "js": {
            "d3": {
                "path": "http://d3js.org/d3.v2.min.js"
            },
            "jQuery": {
                "path": "http://cdn.intermine.org/js/jquery/1.9.1/jquery-1.9.1.min.js"
            },
            "_": {
                "path": "http://cdn.intermine.org/js/underscore.js/1.3.3/underscore-min.js"
            },
            "intermine.imjs": {
                "path": "http://cdn.intermine.org/js/intermine/imjs/2.9.2/im.js",
                "depends": [ "jQuery", "_" ]
            }
        }
    },
    // Example config. Pass this from your middleware that knows about the mine it connects to.
    "config": {
        "mine": "http://metabolicmine.org/beta/service/",
        "pathQueries": {
            "alleleTerms": {
                "select": [
                    "Gene.symbol",
                    "Gene.alleles.id",
                    "Gene.alleles.genotypes.id",
                    "Gene.alleles.genotypes.phenotypeTerms.id",
                    "Gene.alleles.genotypes.phenotypeTerms.name"
                ],
                "constraints": []
            },
            "highLevelTerms": {
                "select": [
                    "Allele.highLevelPhenotypeTerms.name",
                    "Allele.highLevelPhenotypeTerms.relations.childTerm.name"
                ],
                "constraints": []
            },
            "alleles": {
                "select": [
                    "Gene.alleles.genotypes.phenotypeTerms.name",
                    "Gene.alleles.symbol",
                    "Gene.alleles.primaryIdentifier",
                    "Gene.alleles.name",
                    "Gene.alleles.type",
                    "Gene.alleles.genotypes.geneticBackground",
                    "Gene.alleles.genotypes.zygosity",
                    "Gene.alleles.organism.name"
                ],
                "constraints": []
            }
        }
    }
};