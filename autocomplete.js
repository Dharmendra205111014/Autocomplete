var SELECTED_COLOR = '#F0E1C5';
var UNSELECTED_COLOR = 'white';

var autocomplete = function (obj) {
  this.dataStore = obj.dataArray || [];
  this.inputBox = document.getElementById(obj.inputBox);
  this.async = obj.Async || false;
  this.dataInputBox = obj.doc || {};
  this.suggestionBox = undefined;
  this.minSuggestionChar = obj.minSuggestionChar || 3;
  this.metaData = {};
  this.selectedIndex = -1;
}

autocomplete.prototype.createTemplate = function() {
  var i = document.createElement('input');
  i.setAttribute('class', 'autocompleteInput');
  i.id = this.inputBox.id + 'InputBox';
  var d = document.createElement('div');
  d.setAttribute('class', 'autocompleteSelectBox');
  d.id = this.inputBox.id + 'SuggestionBox';
  d.style.width = i.style.width;

  this.inputBox.appendChild(i);
  this.inputBox.appendChild(d);
  this.dataInputBox = i;
  this.suggestionBox = d;

};

autocomplete.prototype.display = function() {
  this.createTemplate();
  var self = this;
  document.getElementById(this.inputBox.id+'InputBox').addEventListener('keyup', function() {
    if (event.which === 40) {
      self.heilightSuggestionDown();
    } else if (event.which === 38) {
      self.heilightSuggestionUp();
    } else if(event.which === 13){
      self.selectedData();
    } else{
      var val = this.value;
      self.getInputText.call(self, val);
    }
  });

  var content_area = document.getElementById('autoCompleteSuggestionBox');
  document.body.addEventListener("click", function(e) {
  var target = e.target || e.srcElement;
  if (target !== content_area && !isChildOf(target, content_area)) {
    self.close();
  }
}, false);
};

autocomplete.prototype.selectedData = function() {
  this.dataInputBox.value = this.metaData[this.query][this.selectedIndex];
  this.close();
};

autocomplete.prototype.heilightSuggestionDown = function() {
    if(this.selectedIndex<this.metaData[this.query].length-1){
      this.selectedIndex++;
    }
  if(this.selectedIndex !==0 && document.getElementById('acList').childNodes[this.selectedIndex-1]) {
    document.getElementById('acList').childNodes[this.selectedIndex-1].style.background = UNSELECTED_COLOR;
  }
  if(document.getElementById('acList').childNodes[this.selectedIndex]) {
    document.getElementById('acList').childNodes[this.selectedIndex].style.background = SELECTED_COLOR;
    this.upSelected = this.selectedIndex;
  }
  console.log(this.selectedIndex +'Down pressed, selected data is '+ this.metaData[this.query][this.selectedIndex]);
}

autocomplete.prototype.heilightSuggestionUp = function() {
  if(document.getElementById('acList').childNodes[this.selectedIndex]) {
    document.getElementById('acList').childNodes[this.selectedIndex].style.background = UNSELECTED_COLOR;
  }
  if(this.selectedIndex>0) {
      --this.selectedIndex;
  }
  if(document.getElementById('acList').childNodes[this.selectedIndex]) {
    document.getElementById('acList').childNodes[this.selectedIndex].style.background = SELECTED_COLOR;
    this.downSelect = this.selectedIndex;
  }
  console.log(this.selectedIndex +'Up pressed, selected data is '+ this.metaData[this.query][this.selectedIndex]);
}


autocomplete.prototype.getInputText = function(val) {
  this.query = val;
  this.suggestionBox.innerHTML = ""
  if(!this.metaData[val] && this.minSuggestionChar <= val.length) {
    this.createMetaData(val);
  }
  this.buildSuggestionBox(val);
};

autocomplete.prototype.buildSuggestionBox = function(val) {
  var suggestions = this.metaData[val];
  var result;
  this.selectedIndex = -1;
  if(suggestions && suggestions.length > 0) {
    result = '<ul id="acList">';
    for (var i=0; i<suggestions.length; i++) {
      result += '<li>'+ suggestions[i] +'</li>'
    }
    result+='</ul>';
    this.suggestionBox.innerHTML = result;
  }
  if(document.getElementById("acList")) {
    var node = document.getElementById("acList").childNodes;
    var self = this;
    for(var i=0; i<node.length; i++) {
      node[i].addEventListener("click", function(e) {
        self.dataInputBox.value = this.innerHTML;
        self.close();
      });
    }
  }
}

autocomplete.prototype.createMetaData = function(val) {
  var resultArr = [];
  for (var i=0; i<this.dataStore.length; i++) {
    var str = this.dataStore[i].toLowerCase();
    if (str.indexOf(val.toLowerCase()) !== -1) {
      resultArr.push(this.dataStore[i]);
    }
  }
  this.metaData[val] = resultArr;
};

autocomplete.prototype.close = function() {
  if(document.getElementById('acList')) {
    document.getElementById('acList').style.display = "none";
  }
};

function isChildOf(child, parent) {
  if (child.parentNode === parent) {
    return true;
  } else if (child.parentNode === null) {
    return false;
  } else {
    return isChildOf(child.parentNode, parent);
  }
}