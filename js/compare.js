function startSuppression() {
  window.loaded = 0;
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var hashString = read(hash.files[0], 'hash');
    var distributionString= read(distribution.files[0], 'distribution');
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}
function read(file, kind) {
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
function process(result, kind) {
  if (kind == 'hash') {
    window.hashArray = result.replace('"','').replace(/\r/g,'').split(/\r?\n/)
  } else if (kind == 'distribution') {
    window.distributionArray = md5Array($.csv.toObjects(result));
  }
  if (window.loaded == 2) {
    var distro = suppress(hashArray, distributionArray);
    var output = $.csv.fromObjects(distro);
    download('distribution.csv', output);
    cleanUp();
  }
}
function md5Array(distributionArray) {
  if (distributionArray[0].email) {
    var email
    for (var i = 0, row; row = distributionArray[i]; i++) {
      email = row.email
      if (upper.checked) {
        email = email.toUpperCase();
      } else {
        email = email.toLowerCase();
      }
      distributionArray[i].hash = md5(email);
    }
    return distributionArray
  } else {
    alert ("There is no 'email' column in the supplied distribution file.")
  }
}
function suppress(hashArray, distributionArray) {
  var newDistribution = []
  if (hashArray.length > 0) {
    for (var i = 0, row; row=distributionArray[i]; i++) {
      if (!(hashArray.includes(row.hash))) {
        newDistribution.push(row)
      }
    }
    return newDistribution
  } else {
    alert("Hash file did not successfully load")
  }
}
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  var node = document.createTextNode('Download suppressed file')
  element.appendChild(node)
  document.body.appendChild(element);
}
function cleanUp() {
  window.hashArray = []
  window.distributionArray = []
}