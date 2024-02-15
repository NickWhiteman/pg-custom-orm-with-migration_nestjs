import fs from 'fs';

export const createFile = (pathWithFile, contentsFolder) => {
  fs.writeFile(pathWithFile, contentsFolder, (err) => {
    if (err) return console.error(`Fuck, this error: ${err}`);
  });
};

export const getBooleanExistsFile = (folderName) => {
  return fs.root.getDirectory(
    folderName,
    { create: false },
    () => false,
    () => true,
  );
};

export const createFolder = (folderName) => {
  mkdirp(folderName, { recursive: true }, (err) => {
    if (err) return console.error(`Fuck, this error: ${err}`);
  });
};
