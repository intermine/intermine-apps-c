module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,mustache}' ]
                dest: 'build/js/em.js'
                options:
                    main: 'src/app.coffee'
                    name: 'em'

        stylus:
            compile:
                src: [ 'src/styles/app.styl' ]
                dest: 'build/css/em.css'

        concat:            
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/canjs/can.jquery-2.js'
                    'vendor/canjs/can.map.setter.js'
                    'vendor/elasticsearch/index.js'
                    'vendor/moment/moment.js'
                    'vendor/colorbrewer/colorbrewer.js'
                    'vendor/d3/d3.js'
                    'vendor/simple-lru/index.js'
                    # Our app.
                    'build/js/em.js'
                ]
                dest: 'build/js/em.bundle.js'
                options:
                    separator: ';' # for minification purposes

            styles:
                src: [
                    'vendor/foundation/css/normalize.css'
                    'vendor/foundation/css/foundation.css'
                    'vendor/hint.css/hint.css'
                    'vendor/font-awesome/css/font-awesome.css'
                    'src/styles/fonts.css'
                    'build/css/em.css'
                ]
                dest: 'build/css/em.bundle.css'

        copy:
            fonts:
                src: [ 'vendor/font-awesome/fonts/*' ]
                dest: 'build/fonts/'
                expand: yes
                flatten: yes

        uglify:
            scripts:
                files:
                    'build/js/em.min.js': 'build/js/em.js'
                    'build/js/em.bundle.min.js': 'build/js/em.bundle.js'

        cssmin:
            combine:
                files:
                    'build/css/em.bundle.min.css': 'build/css/em.bundle.css'
                    'build/css/em.min.css': 'build/css/em.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')

    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'concat'
        'copy'
    ])

    grunt.registerTask('minify', [
        'uglify'
        'cssmin'
    ])