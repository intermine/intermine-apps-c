module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,mustache}' ]
                dest: 'build/js/ps.js'
                options:
                    main: 'src/app.coffee'
                    name: 'ps'

        stylus:
            compile:
                src: [ 'src/styles/app.styl' ]
                dest: 'build/css/ps.css'

        concat:            
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/canjs/can.jquery.js'
                    'vendor/canjs/can.map.setter.js'
                    'vendor/imjs/js/im.js'
                    # Our app.
                    'build/js/ps.js'
                ]
                dest: 'build/js/ps.bundle.js'
                options:
                    separator: ';' # for minification purposes

            styles:
                src: [
                    'vendor/foundation/css/normalize.css'
                    'vendor/foundation/css/foundation.css'
                    # Our app.
                    'build/css/ps.css'
                ]
                dest: 'build/css/ps.bundle.css'

        uglify:
            scripts:
                files:
                    'build/js/ps.min.js': 'build/js/ps.js'
                    'build/js/ps.bundle.min.js': 'build/js/ps.bundle.js'

        cssmin:
            combine:
                files:
                    'build/css/ps.bundle.min.css': 'build/css/ps.bundle.css'
                    'build/css/ps.min.css': 'build/css/ps.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')

    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'concat'
    ])

    grunt.registerTask('minify', [
        'uglify'
        'cssmin'
    ])