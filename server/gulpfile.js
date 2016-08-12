var gulp   = require( 'gulp' ),
    server = require( 'gulp-develop-server' )
	jshint = require('gulp-jshint');
	
gulp.task('lint', function() {
  return gulp.src('server.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
	
	// run server 
gulp.task( 'server:start', function() {
    server.listen( { path: './server.js' } );
});
 
// restart server if server.js changed 
gulp.task( 'server:restart', function() {
    gulp.watch( [ './server.js' ], server.restart );
});

gulp.task('default', ['lint','server:start','server:restart']);