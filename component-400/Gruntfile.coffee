module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco}' ]
                dest: 'build/js/component-400.js'
                options:
                    main: 'src/app.coffee'
                    name: 'component-400'

        stylus:
            compile:
                options:
                    paths: [ 'src/app.styl' ]
                files:
                    'build/css/component-400.css': 'src/app.styl'

        shell:
            mori:
                options:
                    stdout: yes
                command: 'cd ./vendor/mori/ ; ./scripts/build.sh'

        concat:
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/backbone-events/backbone-events.js'
                    'vendor/blob/Blob.js'
                    'vendor/FileSaver/FileSaver.js'
                    'vendor/mori/mori.js' # is built in the `shell` task
                    # Our app with requirerer.
                    'build/js/component-400.js'
                ]
                dest: 'build/js/component-400.bundle.js'
                options:
                    separator: ';' # we will minify...

            styles:
                src: [
                    # Vendor dependencies.
                    'vendor/foundation3/index.css'
                    'vendor/hint.css/hint.css'
                    # Our style.
                    'build/css/component-400.css'
                ]
                dest: 'build/css/component-400.bundle.css'

        rework:
            app:
                src: [ 'build/css/component-400.css' ]
                dest: 'build/css/component-400.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-component400' ]
                    ]

            bundle:
                src: [ 'build/css/component-400.bundle.css' ]
                dest: 'build/css/component-400.bundle.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-component400' ]
                    ]

        uglify:
            scripts:
                files:
                    'build/js/component-400.min.js': 'build/js/component-400.js'
                    'build/js/component-400.bundle.min.js': 'build/js/component-400.bundle.js'

        cssmin:
            combine:
                files:
                    'build/css/component-400.bundle.min.css': 'build/css/component-400.bundle.css'
                    'build/css/component-400.min.css': 'build/css/component-400.css'
                    'build/css/component-400.bundle.prefixed.min.css': 'build/css/component-400.bundle.prefixed.css'
                    'build/css/component-400.prefixed.min.css': 'build/css/component-400.prefixed.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-shell')
    grunt.loadNpmTasks('grunt-rework')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    #grunt.loadNpmTasks('grunt-notify')

    # Use when watching...
    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'concat'
    ])
    
    # Will build mori, prefix CSS & minify too.
    grunt.registerTask('minify', [
        'apps_c'
        'stylus'
        'shell'
        'concat'
        'rework'
        'uglify'
        'cssmin'
    ])