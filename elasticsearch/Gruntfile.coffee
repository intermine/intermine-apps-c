module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,mustache}' ]
                dest: 'build/js/es.js'
                options:
                    main: 'src/app.coffee'
                    name: 'es'

        stylus:
            compile:
                src: [ 'src/styles/app.styl' ]
                dest: 'build/css/es.css'

        concat:            
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/canjs/can.jquery.js'
                    'vendor/elasticsearch/index.js'
                    'vendor/moment/moment.js'
                    'vendor/colorbrewer/colorbrewer.js'
                    'vendor/d3/d3.js'
                    # Our app.
                    'build/js/es.js'
                ]
                dest: 'build/js/es.bundle.js'
                options:
                    separator: ';' # for minification purposes

            styles:
                src: [
                    'vendor/foundation/css/normalize.css'
                    'vendor/foundation/css/foundation.css'
                    'vendor/hint.css/hint.css'
                    'src/styles/fonts.css'
                    'build/css/es.css'
                ]
                dest: 'build/css/es.bundle.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')

    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'concat'
    ])