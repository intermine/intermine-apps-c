module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco}' ]
                dest: 'build/app.js'
                options:
                    main: 'src/widgets.coffee'
                    name: 'list-widgets'

        concat:
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/underscore/underscore.js'
                    'vendor/backbone/backbone.js'
                    'vendor/google/index'
                    'vendor/imjs/js/im.js'
                    'vendor/fileSaver/index.js'
                    # Our app with requirerer.
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # we will minify...

            # Vendor dependencies.
            styles:
                src: [ 'vendor/bootstrap2/index.css' ]
                dest: 'build/app.bundle.css'

        rework:
            app:
                src: [ 'build/app.css' ]
                dest: 'build/app.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-listwidgets' ]
                    ]

            bundle:
                src: [ 'build/app.bundle.css' ]
                dest: 'build/app.bundle.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-listwidgets' ]
                    ]

        uglify:
            scripts:
                files:
                    'build/app.min.js': 'build/app.js'
                    'build/app.bundle.min.js': 'build/app.bundle.js'

        cssmin:
            combine:
                files:
                    'build/app.bundle.min.css': 'build/app.bundle.css'
                    'build/app.min.css': 'build/app.css'
                    'build/app.bundle.prefixed.min.css': 'build/app.bundle.prefixed.css'
                    'build/app.prefixed.min.css': 'build/app.prefixed.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-rework')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')

    grunt.registerTask('default', [
        'apps_c'
        'concat'
        'rework'
        'uglify'
        'cssmin'
    ])

    grunt.registerTask('build', [
        'apps_c'
        'concat'
    ])