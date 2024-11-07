const { src, dest } = require("gulp");
const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");
var concat = require("gulp-concat");

var browserSync = require("browser-sync").create();

gulp.task("pug", function () {
  return src("project/pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("./dist"))

    .pipe(browserSync.stream());
});

gulp.task("compileSass", function () {
  return src("project/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(postcss([autoprefixer("last 3 versions")]).on("error", sass.logError))

    .pipe(plumber())
    .pipe(sourcemaps.write())
    .pipe(dest("./dist/css/"))
    .pipe(browserSync.stream());
});

gulp.task("image", function () {
  return gulp
    .src("project/imgs/**/*")
    .pipe(gulp.dest("dist/images/"))
    .pipe(browserSync.stream());
});
gulp.task("fonts", function () {
  return gulp
    .src("project/sass/fonts/*")
    .pipe(gulp.dest("dist/fonts/"))
    .pipe(browserSync.stream());
});

gulp.task("js", function () {
  return gulp
    .src("project/js/file.js")
    .pipe(concat("script.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
  });

  gulp.watch("./dist/").on("change", browserSync.reload);
  gulp.watch("project/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("project/sass/**/*.scss", gulp.series("compileSass"));
  gulp.watch("project/js/**/*.js", gulp.series("js"));
  gulp.watch("project/imgs/", gulp.series("image"));
  gulp.watch("project/sass/fonts/", gulp.series("fonts"));
});
