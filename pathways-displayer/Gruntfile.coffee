module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco}' ]
                #src: [ 'src/main.js' ]
                dest: 'build/app.js'
                options:
                    main: 'src/main.js'
                    name: 'PathwaysDisplayer'

        concat:
            scripts:
                src: [
                    'vendor/jquery/jquery.js'
                    'vendor/underscore/underscore.js'
                    'vendor/backbone/backbone.js'
                    'vendor/q/q.js'
                    'vendor/imjs/js/im.js'
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # we will minify...

        rework:
            app:
                src: [ 'example/pathway-displayer.css' ]
                dest: 'build/app.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-pathways-displayer' ]
                    ]

            bundle:
                src: [ 'example/pathway-displayer.css' ]
                dest: 'build/app.bundle.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-pathways-displayer' ]
                    ]
        #jshint:
            #options: grunt.file.readJSON("jshint.json")
            #myFirstLint:
                #files: {
                    #src: ['build/app.js']
                #}
            

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-rework')

    # Will build mori too.
    grunt.registerTask('default', [
        'apps_c'
        'concat'
        'rework'
    ])

    # Use when watching...
    grunt.registerTask('build', [
        'apps_c'
        'concat'
        'rework'
    ])