var compare = function() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('test')
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}

