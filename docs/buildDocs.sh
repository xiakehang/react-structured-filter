#!/usr/bin/env node

/**
 * This example script expects a JSON blob generated by react-docgen as input, 
 * e.g. react-docgen components/* | buildDocs.sh
 */

var fs = require('fs');
var generateMarkdown = require('./generateMarkdown');
var path = require('path');

var json = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    json += chunk;
  }
});

process.stdin.on('end', function() {
  buildDocs( JSON.parse( json ));
});

function buildDoc( filepath, doc ) {
  var name = getComponentName(filepath);
  var markdown = generateMarkdown(name, doc );
  fs.writeFileSync(name + '.md', markdown);
  process.stdout.write(filepath + ' -> ' + name + '.md\n');
}

function buildDocs(api) {
  if ( api.hasOwnProperty( 'description' )) {
    buildDoc( 'index', api );
  } else {
    // api is an object keyed by filepath. We use the file name as component name.
    for (var filepath in api) {
      buildDoc( filepath, api[filepath] );
    }
  }

}

function getComponentName(filepath) {
  var name = path.basename(filepath);
  var ext;
  while ((ext = path.extname(name))) {
    name = name.substring(0, name.length - ext.length);
  }
  return name;
}
