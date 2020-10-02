var api = "AIzaSyBHt947aSFRXbo1wgQGxmam9iRB7wHNkco";
var googleTranslate = require('google-translate')(api);



// var text = 'I am using google translator to convert this text to spanish'
// console.log("English :>",text);

// googleTranslate.translate(text,'hi', function(err, translation) {
//     console.log(translation)
//   console.log("Spanish :>",translation);
// });			

// googleTranslate.getSupportedLanguages((err, languageCodes)=>{
//     console.log(languageCodes)
// })

module.exports = googleTranslate
