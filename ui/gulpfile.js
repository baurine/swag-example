const { task, watch, series, parallel } = require('gulp')
const shell = require('gulp-shell')

task('webpack:start', shell.task('yarn react-scripts start'))

task('swagger:gen', shell.task('cd .. && make api'))

task('swagger:watch', () => watch(['../main.go'], series('swagger:gen')))

task('dev', series('swagger:gen', parallel('swagger:watch', 'webpack:start')))
