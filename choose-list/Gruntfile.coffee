$NAME = 'choose-list'

module.exports = (grunt) ->
    opts =
        pkg: grunt.file.readJSON("package.json")
        
        hogan:
            commonjs:
                templates: 'src/**/*.hogan'
                # Will be cleaned.
                output: 'build/templates.js'
                binder: __dirname + '/misc/hogan.js'
        
        apps_c:
            commonjs:
                src: [
                    'src/**/*.{coffee,js,eco}'
                    'build/templates.js'
                ]
                dest: "build/#{$NAME}.js"
                options:
                    main: 'src/index.js'
                    name: $NAME

        clean: [
            'build/templates.js'
        ]

        stylus:
            compile:
                options:
                    paths: [ 'src/app.styl' ]
                files: {}

        concat:
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/underscore/underscore.js'
                    'vendor/jquery/jquery.js'
                    'vendor/backbone/backbone.js'
                    'vendor/clusterfck/index.js'
                    'vendor/colorbrewer/colorbrewer.js'
                    'vendor/hogan/index.js'
                    'vendor/imjs/js/im.js'
                    'vendor/jquery-slugify/slugify.jquery.js'
                    'vendor/levenshtein/lib/levenshtein.js'
                    'vendor/moment/index.js'
                    'vendor/setimmediate/setImmediate.js'
                    'vendor/async/lib/async.js'

                    # Our app.
                    "build/#{$NAME}.js"
                ]
                dest: "build/#{$NAME}.bundle.js"
                options:
                    separator: ';' # we will minify...

            styles:
                src: [
                    # Vendor dependencies.
                    'vendor/foundation4/index.css'
                    # Our styles.
                    'src/fonts.css'
                    # Built styles.
                    "build/#{$NAME}.css"
                ]
                dest: "build/#{$NAME}.bundle.css"

        rework:
            app:
                src: [ "build/#{$NAME}.css" ]
                dest: "build/#{$NAME}.prefixed.css"
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-chooselist' ]
                    ]

            bundle:
                src: [ "build/#{$NAME}.bundle.css" ]
                dest: "build/#{$NAME}.bundle.prefixed.css"
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-chooselist' ]
                    ]

        uglify:
            scripts:
                files: {}

        cssmin:
            combine:
                files: {}

    # Stylus.
    opts.stylus.compile.files[ "build/#{$NAME}.css" ] = 'src/app.styl'
    
    # JS minify.
    opts.uglify.scripts.files[ "build/#{$NAME}.min.js" ] = "build/#{$NAME}.js"
    opts.uglify.scripts.files[ "build/#{$NAME}.bundle.min.js" ] = "build/#{$NAME}.bundle.js"

    # CSS minify.
    opts.cssmin.combine.files[ "build/#{$NAME}.bundle.min.css" ] = "build/#{$NAME}.bundle.css"
    opts.cssmin.combine.files[ "build/#{$NAME}.min.css" ] = "build/#{$NAME}.css"
    opts.cssmin.combine.files[ "build/#{$NAME}.bundle.prefixed.min.css" ] = "build/#{$NAME}.bundle.prefixed.css"
    opts.cssmin.combine.files[ "build/#{$NAME}.prefixed.min.css" ] = "build/#{$NAME}.prefixed.css"

    # Init config & tasks.
    grunt.initConfig opts

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-hogan')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-rework')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-clean')

    # Will prefix CSS & minify too.
    grunt.registerTask('default', [
        'hogan'
        'apps_c'
        'clean'
        'stylus'
        'concat'
        'rework'
        'uglify'
        'cssmin'
    ])

    # Use when watching...
    grunt.registerTask('build', [
        'hogan'
        'apps_c'
        'clean'
        'stylus'
        'concat'
    ])