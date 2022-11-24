const fs = require("fs");
const https = require("node:https");

const options = {
  hostname: "nc-leaks.herokuapp.com",
  path: "/api/confidential",
  method: "GET",
};

const request = https.request(options, (response) => {
  response.setEncoding("utf8");

  let body = "";

  response.on("data", (packet) => {
    console.count("packet number ...");
    body += packet;
  });
  response.on("end", () => {
    const parsedBody = JSON.parse(body);
    const instructions = parsedBody.instructions;
    console.log(instructions);
    fs.writeFile("instructions.md", instructions, (err) => {
      console.log("file saved");
    });
  });
});

request.end();
