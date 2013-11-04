module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco}' ]
                dest: 'build/app.js'
                options:
                    main: 'src/app.coffee'
                    name: 'component-400'

        stylus:
            compile:
                options:
                    paths: [ 'src/styles/app.styl' ]
                files:
                    'build/app.css': 'src/styles/app.styl'

        concat:
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/backbone-events/backbone-events.js'
                    'vendor/csv/lib/csv.js'
                    'vendor/FileSaver/FileSaver.js'
                    'vendor/queue-async/queue.js'
                    'vendor/setimmediate/setImmediate.js'
                    # Our app with requirerer.
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # we will minify...

            styles:
                src: [
                    # Vendor dependencies.
                    'src/styles/foundation.css'
                    # Our style.
                    'build/app.css'
                ]
                dest: 'build/app.bundle.css'

        uglify:
            my_target:
                files:
                    'build/app.min.js': 'build/app.js'
                    'build/app.bundle.min.js': 'build/app.bundle.js'


        cssmin:
            combine:
                files:
                    'build/app.min.css': 'build/app.css'
                    'build/app.bundle.min.css': 'build/app.bundle.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')

    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'concat'
        'uglify'
        'cssmin'
    ])