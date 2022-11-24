const https = require("node:https");
const fs = require("fs");
const { parse } = require("node:path");
const { getPackedSettings } = require("node:http2");

function getPeople() {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/people",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    response.setEncoding("utf8");

    let body = "";

    response.on("data", (packet) => {
      body += packet;
    });
    response.on("end", () => {
      const parsedBody = JSON.parse(body);
      const people = parsedBody.people;
      const northcoders = people.filter(
        (person) => person.job.workplace == "northcoders"
      );
      const jsonNorthcoders = JSON.stringify(northcoders);
      fs.writeFile("northcoders.json", jsonNorthcoders, (err) => {
        console.log("file saved");
      });
    });
  });
  request.end();
}

function getInterests() {
  fs.readFile("northcoders.json", "utf8", (err, data) => {
    const parsedData = JSON.parse(data);
    const usernames = parsedData.map((user) => user.username);
    const interestsArray = [];
    let userCount = 0;
    usernames.forEach((user) => {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${user}/interests`,
        method: "GET",
      };
      const request = https.request(options, (response) => {
        userCount++;
        response.setEncoding("utf8");
        let body = "";
        response.on("data", (packet) => {
          body += packet;
        });
        response.on("end", () => {
          const parsedBody = JSON.parse(body);
          parsedBody.person.interests.forEach((interest) => {
            interestsArray.push(interest);
          });
        });
        if (userCount === usernames.length) {
          const jsonInterests = JSON.stringify(interestsArray);
          fs.writeFile("interests.json", jsonInterests, (err) => {
            console.log("file saved");
          });
        }
      });
      request.end();
    });
  });
}


function getPets() {
  fs.readFile("northcoders.json", "utf8", (err, data) => {
    const parsedData = JSON.parse(data);
    const usernames = parsedData.map((user) => user.username );
    
    const petsArray = [];
    let userCount = 0;
    usernames.forEach((user) => {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${user}/pets`,
        method: "GET",
      };
      const request = https.request(options, (response) => {
        userCount++;
        response.setEncoding("utf8");
        let body = "";
        response.on("data", (packet) => {
          body += packet;
        });
        response.on("end", () => {
          const parsedBody = JSON.parse(body);
          // console.log(parsedBody)
          if(parsedBody.hasOwnProperty('person')){
          parsedBody.person.pets.forEach((pet) => {
            petsArray.push(pet);
          });}
        });
        if (userCount === usernames.length) {
          console.log(petsArray, 'petarray');
          const jsonPets = JSON.stringify(petsArray);
          // fs.writeFile("pets.json", jsonPets, (err) => {
          //   console.log("file saved");
          // });
        }
      });
      request.end();
    });
  });

}
getPets()
