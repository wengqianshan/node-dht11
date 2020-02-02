const http = require('http');
const sensor = require("node-dht-sensor").promises;

const server = http.createServer(async (req, res) => {
  
  const contentType = req.headers['content-type'];
  
  res.writeHead(200, {
    'Content-Type': contentType || 'text/html'
  });

  let temperature = '-';
  let humidity = '-';

  try {
    const res = await sensor.read(11, 4);
    temperature = res.temperature.toFixed(1);
    humidity = res.humidity.toFixed(1);
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }

  if (contentType === 'application/json') {
    res.write(JSON.stringify({
      temperature,
      humidity
    }));
  } else {
    res.write(`
<!doctype html>
<html>
<head>
    <title>温湿度</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <style type="text/css">
      .app{
        margin: 12px;
        text-align: center;
        font-size: 16px;
      }
      .code{
        font-weight: bold;
      }
    </style>
</head>
<body>
  <div class="app">
    温度: <span class="code">${temperature}°C</span><br />
    湿度: <span class="code">${humidity}%</span>
  </div>
</body>
</html>
`);
  }

  res.end();
});
server.listen(8000, '0.0.0.0');