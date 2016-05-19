var start = function() {
  window.loaded = 0;
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var hashString = read(hash.files[0], 'hash');
    var distributionString= read(distribution.files[0], 'distribution');
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}
var read = function(file, kind) {
  var reader = new FileReader();
  reader.kind = kind
  reader.onload = (function(theFile) {

    return function(e) {
      window.loaded += 1;
      var fileString = reader.result;
      process(fileString, reader.kind);
    }
  })(file);
  reader.readAsText(file);
  }
var process = function(result, kind) {
  if (kind == 'hash') {
    window.hashArray = result.replace('"','').split(/\r?\n/);
  } else if (kind == 'distribution') {
    window.distributionArray = md5Array($.csv.toObjects(result));
  }
  if (window.loaded == 2) {
    var distro = suppress(hashArray, distributionArray);
    var output = $.csv.fromObjects(distro);
    console.log(output)
    download('distribution.csv', output);
  }
}
var md5Array = function(distributionArray) {
  if (distributionArray[0].email) {
    for (var i = 0, row; row = distributionArray[i]; i++) {
      distributionArray[i].hash = md5(distributionArray[i].email)
    }
    return distributionArray
  } else {
    alert ("There is no 'email' column in the supplied distribution file.")
  }
}
var suppress = function(hashArray, distributionArray) {
  var newDistribution = []
  for (var i = 0, row; row=distributionArray[i]; i++) {
    if (!(hashArray.includes(row.hash))) {
      newDistribution.push(row)
    }
  }
  return newDistribution
}
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  var node = document.createTextNode('Download suppressed file')
  element.appendChild(node)
  document.body.appendChild(element);
}