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
                    'vendor/setImmediate/index.js'
                    'vendor/async/lib/async.js'
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

        uglify:
            my_target:
                files:
                    'build/app.min.js': 'build/app.js'
                    'build/app.bundle.min.js': 'build/app.bundle.js'


        cssmin:
            combine:
                files:
                    'build/app.bundle.min.css': 'build/app.bundle.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')

    grunt.registerTask('default', [
        'apps_c'
        'concat'
    ])

    grunt.registerTask('minify', [
        'uglify'
        'cssmin'
    ])