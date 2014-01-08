module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
       
        connect:
            server:
                options:
                    port: 9002
                    # Access from anywhere.
                    hostname: '*'
                    # Serve this.
                    base: '.'
                    # Keep running.
                    keepalive: yes
                    # Debug.
                    debug: yes

    grunt.loadNpmTasks('grunt-contrib-connect')

    grunt.registerTask('default', [ 'connect' ])