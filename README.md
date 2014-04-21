collaboard
==========

Collaboration board to integrate several people around a project in real time.

This project is based on nodejs, mongodb and redis.

	- Install and run mongo on port 27017.
	- Install and run redis on port 6379.
	- Execute npm install -g on project home.
	- Execute node app.js to run the server on port 8080.

Now you can access localhost:8080/ to execute login. There are no users created by default.

You can create users, executing the command below on mongo-cli:

db.logincollection.insert({"_id" : '123', "username" : "username", "password" : "password", "hash" : "4567891234abc1312" });

Now you are ready to login. Execute login, click on left corner of your board (boards), create a new board, select it and you are ready to go.

If you want to share you board view. Copy the url of your browser and send to someone