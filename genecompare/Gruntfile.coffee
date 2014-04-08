module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco}' ]
                #src: [ 'src/main.js' ]
                dest: 'build/app.js'
                options:
                    main: 'src/main.coffee'
                    name: 'GeneCompare'

        concat:
            scripts:
                src: [
                    'vendor/jquery/jquery.js'
                    'vendor/underscore/underscore.js'
                    'vendor/backbone/backbone.js'
                    'vendor/q/q.js'
                    'vendor/imjs/js/im.js'
                    'vendor/d3/d3.min.js'
                    'vendor/spinjs/spin.js'
                    'vendor/angular/angular.min.js'
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # we will minify...

        #jshint:
            #options: grunt.file.readJSON("jshint.json")
            #myFirstLint:
                #files: {
                    #src: ['build/app.js']
                #}
            

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-concat')

    # Will build mori too.
    grunt.registerTask('default', [
        'apps_c'
        'concat'
    ])

    # Use when watching...
    grunt.registerTask('build', [
        'apps_c'
        'concat'
    ])