const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

function searchItems(text) {
    const words = tokenizer.tokenize(text);
    return words;
}

module.exports = { searchItems };
