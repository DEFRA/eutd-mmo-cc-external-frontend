module.exports = {
    createOldCatalogs: false,
    indentation: 2,
    keepRemoved: true,
    lexers: {
        js: ['JavascriptLexer'],
    },
    locales: ['en', 'cy'],
    output: 'src/locales/uk/extracted.json',
    input: ['./**/*.{js,jsx,ts,tsx}'],
    sort: true,
    verbose: true,

};