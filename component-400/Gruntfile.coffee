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
                    # Our style.
                    'build/app.css'
                ]
                dest: 'build/app.bundle.css'

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-shell')
    #grunt.loadNpmTasks('grunt-notify')

    # Will build mori too.
    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'shell'
        'concat'
    ])

    # Use when watching...
    grunt.registerTask('build', [
        'apps_c'
        'stylus'
        'concat'
    ])