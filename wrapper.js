const { exec } = require('child_process');
const { app } = require('./server.js'); 

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  exec(`start http://localhost:${port}`); // Opens default browser on Windows
});
