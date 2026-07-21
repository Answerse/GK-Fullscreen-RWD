// JXA script to get browser measurements
var app = Application('Safari');
app.includeStandardAdditions = true;

// Open the URL
var doc = app.Document({url: 'http://localhost:8080/agriculture.html'});
app.documents.push(doc);
delay(5);

// Execute JavaScript in the page - single line to avoid syntax issues
var jsCode = 'JSON.stringify({htmlScrollHeight:document.documentElement.scrollHeight,htmlClientHeight:document.documentElement.clientHeight,bodyScrollHeight:document.body.scrollHeight,bodyClientHeight:document.body.clientHeight,mcScrollHeight:document.querySelector(".main-container")?.scrollHeight,mcClientHeight:document.querySelector(".main-container")?.clientHeight,lastSectionId:document.querySelector("#contact")?.id,lastSectionSH:document.querySelector("#contact")?.scrollHeight,lastSectionCH:document.querySelector("#contact")?.clientHeight,lastSectionOT:document.querySelector("#contact")?.offsetTop,lastSectionOH:document.querySelector("#contact")?.offsetHeight,winIH:window.innerHeight,docCH:document.documentElement.clientHeight,bodyBg:getComputedStyle(document.body).backgroundColor,htmlBg:getComputedStyle(document.documentElement).backgroundColor,bb:(function(){var b=document.querySelector(".brand-bar");if(!b)return null;var s=getComputedStyle(b);return{display:s.display,position:s.position,bottom:s.bottom,height:b.offsetHeight,rectTop:b.getBoundingClientRect().top,rectBottom:b.getBoundingClientRect().bottom}})()})';

var result = doc.doJavaScript(jsCode);
console.log(result);

// Also write to file
var filePath = '/Users/answerose/Documents/Projects/GK-Fullscreen-RWD/_measurements_output.json';
app.write(result, {to: filePath, as: 'text'});