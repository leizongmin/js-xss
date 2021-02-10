mkdir "./dist"

echo "browserify..."
node ./node_modules/browserify/bin/cmd.js "./lib/index.js" > "./dist/xss.js"
echo "output ./dist/xss.js"

echo "minify..."
node ./node_modules/uglify-js/bin/uglifyjs "./dist/xss.js" -o "./dist/xss.min.js"
echo "output ./dist/xss.min.js"

echo "done."
