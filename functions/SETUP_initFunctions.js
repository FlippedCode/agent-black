module.exports.run = async (client, fs, config) => {
  const functionsFolder = config.setup.moduleFolders.functionsFolder;
  // read directory with functions
  fs.readdir(`./${functionsFolder}`, (err, files) => {
    // error if fails
    if (err) console.error(err);

    // removal of '.js' in the end of the file
    const jsfiles = files.filter((f) => f.split('.').pop() === 'js');

    // check if functions are there
    if (jsfiles.length <= 0) return console.log('No function(s) to load!');

    console.log(`Loading ${jsfiles.length} function(s)...`);

    // adding all functions
    jsfiles.forEach((f, i) => {
      let probs = require(`../${functionsFolder}/${f}`);
      console.log(`    ${i + 1}) Loaded: ${f}!`);
      // adding function to collection
      client.functions.set(probs.help.name, probs);
    });

    console.log(`Loaded ${jsfiles.length} function(s)!`);
  });
};

module.exports.help = {
  name: 'SETUP_initFunctions',
};