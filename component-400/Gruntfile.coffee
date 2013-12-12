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
                    paths: [ 'src/app.styl' ]
                files:
                    'build/app.css': 'src/app.styl'

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
                    'vendor/csv/lib/csv.js'
                    'vendor/blob/Blob.js'
                    'vendor/FileSaver/FileSaver.js'
                    'vendor/mori/mori.js' # is built in the `shell` task
                    # Our app with requirerer.
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # we will minify...

            styles:
                src: [
                    # Vendor dependencies.
                    'vendor/foundation3/index.css'
                    'vendor/hint.css/hint.css'
                    # Our style.
                    'build/app.css'
                ]
                dest: 'build/app.bundle.css'

        rework:
            app:
                src: [ 'build/app.css' ]
                dest: 'build/app.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-component400' ]
                    ]

            bundle:
                src: [ 'build/app.bundle.css' ]
                dest: 'build/app.bundle.prefixed.css'
                options:
                    use: [
                        [ 'rework.prefixSelectors', '.-im-component400' ]
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
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-shell')
    grunt.loadNpmTasks('grunt-rework')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    #grunt.loadNpmTasks('grunt-notify')

    # Will build mori, prefix CSS & minify too.
    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'shell'
        'concat'
        'rework'
        'uglify'
        'cssmin'
    ])

    # Use when watching...
    grunt.registerTask('build', [
        'apps_c'
        'stylus'
        'concat'
    ])