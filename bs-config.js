module.exports = {
  "files": [
    "./build/**/*",
    "./statics/**/*"
  ],
  "server": {
    "baseDir": "./",
    "middleware": (req, res, next) => {
      const timestamp = `[${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}]`;
      console.log(`${timestamp} <${req.method}> ${req.originalUrl} - ${req.connection.remoteAddress} - ${req.headers['user-agent']}`);
      next();
    }
  },
  "logPrefix": "prj",
  "tagNames": {
    "less": "link",
    "scss": "link",
    "css": "link",
    "jpg": "img",
    "jpeg": "img",
    "png": "img",
    "svg": "img",
    "gif": "img",
    "js": "script",
    "jsx": "script",
    "ts": "script",
    "tsx": "script"
  }
};