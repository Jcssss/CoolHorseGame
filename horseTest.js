/***********************************************************************************
* Name:        Quest for the Carrot (Cool Horse Game)
* Author:      Justin Siu
* Date:        Jan 13,2019
* Purpose:     To play a graphical platform game with a horse as the main character.

Game runs on:
	Chrome 63 or later, IE 11 and Firefox on school computers
Game does not run on:
	Chrome on Android
****************************************************************************************/

var c; // the canvas
var ctx; // the context of the canvas
var myKey; // the key pressed

var myHorse; // stores Image of horse, used as a boolean for some if statements

var carrotsGrab = 0; // the number of carrots grabbed

var frameNo = 0; // the frame number
var level = 0; // the level
var hearts = 0; // number of lives

var myHorse = false;
var groundHeight = 0; // The height of the full image of the ground
var groundLevel = 0; // The height that the horse should be running on
var isWin = false; // did you win
var isLose = false; // did you lose
var isPlay = false; // are you playing
var isFinish = false; // is the game finished
var spaceIsPressed = false; // used so that keys only trigger once when pressed

var myTitle = new Image(); // title image
var myWater = new Image(); // water image
var myExampleWater = new Image(); // water image used for instructions
var myDogRight = new Array (5); // dog images facing right
var myDogLeft = new Array (5); // dog images facing left
var myBirdRight = new Array (4); // bird images facing right
var myBirdLeft = new Array (4); // bird images facing left
var myRock = new Image(); // rock image
var myGround = new Image(); // ground image
var myPlatform = new Image(); // platform image
var myTallLandform = new Image(); // tall landform image
var myShortLandform = new Image(); // short landform image
var myCarrot = new Image(); // carrot image
var myHeart = new Image(); // heart image
var myHorseRight = new Array(5); // horse image facing right
var myHorseLeft = new Array(5); // horse image facing left
var myHorseJumpRight = new Image(); // horse jumping image facing right
var myHorseJumpLeft = new Image(); // horse jumping image facing left
var myTrophy = new Image(); // trophy image
var myWin = new Image(); // image of the words "you win"
// object storing data for short landform
var shortLandform = {
	
	// draws short landform and changes properties based on position
	draw: function (left) {
		
		// sets hitbox
		this.left = left;
		this.right = this.left + Math.floor(calc(c.width, 22));
		this.roof = c.height - calc(groundHeight, 25);
		
		// draws image
		ctx.drawImage (myShortLandform, this.left, c.height - groundHeight, c.width, groundHeight );
		this.exist = true;
	}, // draw
	left: 0, // left side of the hitbox
	right: 0, // right side of the hitbox
	roof: 0, // top of the hitbox
	exist: false // is there a short landform in the level
}; // shortLandform

// object storing data for tall landform
var tallLandform = {
	
	// draws tall landform and changes properties based on position
	draw: function (left) {
		
		// sets hitbox
		this.left = left;
		this.right = this.left + Math.floor(calc(c.width, 21));
		this.roof = c.height - calc(groundHeight, 36);
		
		// draws image
		ctx.drawImage (myTallLandform, this.left, c.height - groundHeight, c.width, groundHeight );
		this.exist = true;
	}, // draw
	left: 0, // left side of hitbox
	right: 0, // right side of hitbox
	roof: 0, // top of hitbox
	exist: false // is there a tall landform in the level
}; // tallLandform

// object storing data for horse
var horse = {
	
	// draws tall landform and changes properties based on position
	draw: function (left) {
		
		// determines image number of horse
		var horseNum = Math.floor(frameNo / 7) % 5;
		
		// if the horse is hurt
		if (this.hurt) {
			
			// if the horse is dead
			if (this.dead) {
				
				// death animation
				this.speedY = - 7.6 + (this.timer * 0.3);
				groundLevel = c.height + this.size;
				if (heart.y >= c.height) {
					isLose = true;
				} // if 
			} // if 
			
			// counts the amount of frames that have passed since being hurt
			this.timer ++;
			
			// draws heart
			heart.draw();
			
			// makes horse transparent
			ctx.globalAlpha = 0.5;
			
			// if 100 frames have passed
			if (this.timer == 100) {
				
				// resets variables
				heart.first = true;
				this.hurt = false;
				this.timer = 0;
			} // if 
		} // if 
		
		// sets properties only once
		if (this.first && hearts != 0) {
			this.first = false;
			this.x = left;
			this.timer = 0;
		} // if 
		
		// sets hitbox
		this.left = this.x + Math.floor(this.size / 32 * 7);
		this.roof = this.y + this.size / 32 * 14;
		this.right = this.x + Math.floor(this.size / 32 * 24);
		this.bottom = this.y + this.size;
		
		// draws image based on the way the horse is moving
		if (this.isRight) {
			
			// if the horse is moving upwards
			if (this.speedY < 0) {
				
				// draw jumping image
				ctx.drawImage (myHorseJumpRight, this.x, this.y, this.size, this.size);
			} else {
				
				// draw running image
				ctx.drawImage (myHorseRight[horseNum], this.x, this.y, this.size, this.size);
			} // if
		} else {
			
			// if the horse is moving upwards
			if (this.speedY < 0) {
				
				// draw jumping image
				ctx.drawImage (myHorseJumpLeft, this.x, this.y, this.size, this.size);
			} else {
				
				// draw running image
				ctx.drawImage (myHorseLeft[horseNum], this.x, this.y, this.size, this.size);
			} // if
		} // if 
		ctx.globalAlpha = 1;
	}, // draw
	size: 0, // size of the image
	left: 0, // left side of hitbox
	x: 0, // the x position of the image
	roof: 0, // top of the hitbox
	y: 0, // y position of the image
	right: 0, // right side of the hitbox
	bottom: 0, // bottom of th hitbox
	speedY: 0, // measures how fast the horse should fall, creates gravity
	isRight: true, // which way is the horse moving
	hurt: false, // is the horse hurt
	dead: false, // is the horse dead
	timer: 0, // acts as a timer
	first: 0, // is this the first time the horse is being drawn in a level
	
	// resets horse variables 
	resetHorse: function (ground) {
		this.size = Math.floor(c.width / 15);
		this.y = ground - this.size;
		this.speedY = 0;
		this.first = true;
		this.dead = false;
		this.hurt = false;
		this.isRight = true;
	} // resetHorse
}; // horse

// object storing data for carrot
var carrot = {
	
	// draws the carrot and sets hitbox based on position
	draw: function (left, ground) {
		
		// sets size
		this.size = horse.size;
		
		// sets hitbox
		this.roof = ground - this.size / 25 * 16;
		this.right = left + Math.floor((this.size / 25 * 8));
		this.left = left + Math.floor((this.size / 25 * 3));
		this.bottom = ground;
		
		// draws image
		ctx.drawImage (myCarrot, left, ground - this.size, this.size, this.size);
		this.exist = true;
	}, // draw
	size: 0, // size of the carrot
	left: 0, // left side of hitbox
	roof: 0, // top of hitbox
	right: 0, // right side of hitbox
	bottom: 0, // bottom of hitbox
	exist: false // is there a carrot in the level
}; // carrot

// object storing data for bird
var bird = {
	draw: function (left, roof) {
		
		// determines the image number of the bird
		birdNum = Math.floor(frameNo / 7) % 4;
		
		// if the bird hasn"t fallen out of the map
		if (this.roof < c.height) {
			
			// if this is the first time the bird is being drawn in the level
			if (this.first) {
				this.first = false;
				this.dead = false;
				this.x = left;
				this.roof = roof + this.size / 7;
				
				// creates jumping effect
				this.speedY = -7.6;
			} // if 
			
			// if the bird is dead
			if (this.dead) {
				
				// creates falling effect
				this.speedY += 0.3;
				this.roof += this.speedY;
			} // if 
			
			// sets hitbox
			this.left = this.x + this.size / 14 * 4;
			this.size = Math.floor(calc(horse.size, 108));
			this.bottom = this.roof + this.size / 14 * 8;
			this.right = this.left + this.size / 14 * 6;
			
			// draws an image based on which way the bird is moving
			if (this.isRight) {
				ctx.drawImage (myBirdRight[birdNum], this.x, this.roof, this.size, this.size);
			} else {
				ctx.drawImage (myBirdLeft[birdNum], this.x, this.roof, this.size, this.size);
			} // if 
			this.exist = (this.dead)? false : true;
		} // if 
	}, // draw
	size: 0, // size of the bird
	x: 0, // x position of the image
	left: 0, // left side of the hitbox
	roof: 0, // top of the hitbox
	bottom: 0, // bottom of the hitbox
	right: 0, // right side of the hitbox
	speedY: 0, // speed at which the bird should fall
	dead: false, // is the beard dead
	isRight: true, // which way is the bird facing
	first: true, // is this the first time the bird is being drawn in a level
	exist: false // is there a bird in the level
}; // bird

// object storing data for rock
var rock = {
	
	// draws the image and determines properties based on position
	draw: function (left, roof) {
		
		// determines hitbox
		this.left = left + this.width / 11;
		this.right = left + this.width / 11 * 10;
		this.roof = roof + this.height / 11 * 6;
		this.bottom = roof + this.height;
		
		// determins size
		this.width = calc(c.width, 11);
		this.height = calc(groundHeight, 11);
		
		// draws image
		ctx.drawImage (myRock, left, roof, this.width, this.height);
		this.exist = true;
	}, // draw
	width: 0, // width of image
	height: 0, // height of image
	left: 0, // left side of the hitbox
	roof: 0, // top of the hitbox
	bottom: 0, // bottom of the hitbox
	right: 0, // right side of the hitbox
	exist: false // is there a rock in the level
}; // rock

// object storing data for water
var water = {
	
	// draws an image and determines properties based on position
	draw: function (left) {
		
		// determines hitbox
		this.left = left + calc(c.width, 9);
		this.right = left + calc(c.width, 23);
		this.bottom = c.height - calc(groundHeight, 9);
		
		// draws image
		ctx.drawImage (myWater, left, c.height - groundHeight, c.width, groundHeight);
		
		// draws rectangle on top of water to hide line
		ctx.fillStyle = c.style.backgroundColor;
		ctx.fillRect(this.left, c.height - calc(groundHeight, 21), this.right - this.left, calc(c.height,8));
		this.exist = true;
	}, // draw
	roof: 0, // top of the hitbox
	left: 0, // left of the hitbox
	bottom: 0, // bottom of the hitbox
	right: 0, // right of the hitbox
	exist: false // is there water in the level
}; // water

// object storing data for platforms
var platform = {
	
	// draws images of the platforms
	draw: function () {
		
		// draws all images of platforms
		for (i in this.roof) {
			ctx.drawImage (myPlatform, this.left[i], this.roof[i] - this.height / 22 * 15, this.width, this.height);
		} //for
		this.exist = true;
	}, 	// draw
	width: 0, // width of platform image
	height: 0, // height of platform image
	left: new Array (), // array of left hitbox values of all platforms
	right: new Array (), // array of right hitbox values of all platforms
	roof: new Array (), // array of roof hitbox values of all platforms
	declare: false, // have all platfroms been declared
	exist: false, // are there platforms in this level
	
	// creates a new platform 
	newPlatform: function (left,roof) {
		this.left.push(left);
		this.right.push(left + this.width);
		this.roof.push(roof + this.height / 22 * 15);
	}, // newPlatform
	
	// resets variables
	resetPlatform: function () { 
		this.left = new Array ();
		this.right = new Array ();
		this.roof = new Array ();
		this.width = calc(c.width, 22);
		this.height = calc(groundHeight, 22);
		platform.declare = false;
	}, // resetPlatform
	on: -1 // which platform is the horse on, -1 means that it"s not on a platform
}; // platform

// object storing data for dog
var dog = {
	
	// draws image of dog and sets properties based on its position
	draw: function (x) {
		
		// determines the image number of the dog
		var dogNum = Math.floor(frameNo / 7) % 5;
		
		// if the dog is on the map
		if (this.y < c.height) {

			// is this the first time the dog has been drawn
			if (this.first) {
				this.first = false;
				this.dead = false;
				this.x = x;
				this.bottom = c.height - calc(groundHeight, 20);
				
				// creates jumping effect
				this.speedY = -7.6;
			} // if 
			
			// if the dog is dead
			if (this.dead) {
				
				// creates falling effect
				this.speedY += 0.3;
				this.y += this.speedY;
			} else {
				
				// sets the horse to running on the ground
				this.y = c.height - calc(groundHeight, 20) - horse.size / 32 * 28;
			} // if 
			
			// determine size of dog
			this.size = horse.size / 32 * 28;
			
			// determines hitbox
			this.left = Math.floor(this.x + this.size / 28 * 6);
			this.right = Math.floor(this.x + this.size / 28 * 22);
			this.roof = this.y + this.size / 28 * 11;
			
			// draws image of dog based on which way it"s moving
			if (this.isRight) {
				ctx.drawImage(myDogRight[dogNum], this.x, this.y, this.size, this.size);
			} else {
				ctx.drawImage(myDogLeft[dogNum], this.x, this.y, this.size, this.size);
			} // if 
			this.exist = (this.dead)? false : true;
		} // if 
	}, // draw
	roof: 0, // top of the hitbox
	left: 0, // left of the hitbox
	right: 0, // right of the hitbox
	bottom: 0, // bottom of the hitbox
	x: 0, // x position of the image
	y: 0, // y position of the image
	speedY: 0, // speed at which the dog should fall
	size: 0, // size of the image
	dead: false, // is the dog dead
	isRight: true, // which way is the dog moving
	first: true, // is this the first time the dog is being drawn in the level
	exist: false // does the dog exist
}; // dog

// object storing data for heart
var heart = {
	
	// draws an image of the heart and determines the properties based on the position
	draw: function () {
		
		// is this the first time the heart is being drawn
		if (this.first) {
			this.first = false;
			this.size = 20;
			
			// determines position based on horse position
			this.x = horse.x + (horse.size - this.size) / 2;
			this.y = horse.y;
			
			// creates jumping effect
			this.speedY = -7.6;
			hearts --;
		} // if 
		
		// creates falling effect
		this.speedY += 0.3;
		this.y += this.speedY;
		
		// draws image
		ctx.drawImage(myHeart, this.x, this.y, this.size,this.size);
	}, // draw
	size: 0, // size of image
	x: 0, // x position of image
	y: 0, // y position of image
	speedY: 0, // speed that the heart should fall at
	first: true // is this the first time the heart is being drawn
}

// starts the game, run on screen load
function startGame () {
	
	// load horse images
	for (var i = 0; i < myHorseRight.length; i++) {
		myHorseRight[i] = new Image();
		myHorseLeft[i] = new Image();
		myHorseRight[i].src = "images/runRight_" + i + ".png";
		myHorseLeft[i].src = "images/runLeft_" + i + ".png";
	} // for
	
	// load dog images
	for (var i = 0; i < myDogRight.length; i++) {
		myDogRight[i] = new Image();
		myDogLeft[i] = new Image();
		myDogRight[i].src = "images/dogRight" + i + ".png";
		myDogLeft[i].src = "images/dogLeft" + i + ".png";
	} // for
	
	// load bird images
	for (var i = 0; i < myBirdRight.length; i++) {
		myBirdRight[i] = new Image();
		myBirdLeft[i] = new Image();
		myBirdRight[i].src = "images/flyRight_" + i + ".png";
		myBirdLeft[i].src = "images/flyLeft_" + i + ".png";
	} // for
	
	// load other images
	myTitle.src = "images/Title.png";
	myWater.src = "images/groundWater.png";
	myExampleWater.src = "images/water.png";
	myRock.src = "images/rock.png";
	myGround.src = "images/ground.png";
	myCarrot.src = "images/carrot.png";
	myHeart.src = "images/heart.png";
	myShortLandform.src = "images/shortForm.png";
	myTallLandform.src = "images/tallForm.png";
	myPlatform.src = "images/platform.png";
	myHorseJumpLeft.src = "images/jumpLeft.png";
	myHorseJumpRight.src = "images/jumpRight.png";
	myTrophy.src = "images/trophy.png";
	myWin.src = "images/win.png";
	
	// identif ies and get"s the context of the canvas
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	
	// set canvas dimensions
	c.height = 600;
	c.width = 1000;
	
	// set the height of the ground image
	groundHeight = c.width / 9 * 7;
	
	// adds EventListeners
	window.addEventListener("keydown", function (e) {
		
		// gets the value of the key
		myKey = e.keyCode;
	}) // EventListener

    window.addEventListener("touchstart", function (e) {
		
		// gets the value of the key
		myKey = 32;

	}) // EventListener

    window.addEventListener("touchend", function (e) {
		
		// resets variables
		myKey = false;
		spaceIsPressed = false;
	}) // EventListener

	window.addEventListener("keyup", function (e) {
		
		// resets variables
		myKey = false;
		spaceIsPressed = false;
	}) // EventListener
	
	// sets an interval that plays the game
	setInterval(drawScene, 15);
	
} // startGame

// draws the game
function drawScene () {
	
	// if first screen
	if (level == 0) {
		 
		clear();
		c.style.backgroundColor = "#ffffff";
		
		// display title
		ctx.drawImage(myTitle, 110, c.height - c.width / 9 * 8.3, c.width / 9 * 7.6, c.width / 9 * 7.6);
		ctx.font = "30px Arial";
		ctx.fillText("Press space to read instructions!", 280, 570);
		
	// if instruction screen
	} else if (level == 1 && !myHorse){

		// clears screen
		clear();
		
		// set background color of canvas
		c.style.backgroundColor = "#ffffff";
		
		// instructions
		ctx.font = "50px Arial";
		ctx.fillText("Instructions", 30, 80);
		ctx.font = "20px Arial";
		ctx.fillText("Welcome player to the epic Quest for the Carrot!", 30, 130);
		ctx.fillText("1) You are a horse!", 30, 180);
		ctx.drawImage(myHorseLeft[0], 60, 200, 100, 100);
		ctx.fillText("2) Your goal is to grab the carrots!", 250, 180);
		ctx.drawImage(myCarrot, 380, 200, 100, 100);
		ctx.fillText("3) Make sure to avoid obstacles!", 600 ,180);
		ctx.drawImage(myBirdRight[0], 570, 220, 100, 100);
		ctx.drawImage(myRock, 680, 200, 100, 100);
		ctx.drawImage(myExampleWater, 790, 200, 100, 100);
		ctx.fillText("4) There is only one control in the game and that's the space bar! Press the space bar at any time to" , 30 ,375);
		ctx.fillText("jump! if you jump on top of a moving obstacle you'll defeat it and that obstacle will be removed from the", 30, 400);
		ctx.fillText("level! You'll begin the game with 3 lives! Every time you crash into an obstacle, you'll lose a life! if you", 30, 425);
		ctx.fillText("lose all your lives, you'll have to restart from level 1! So be Careful! Your horse will move automatically", 30, 450);
		ctx.fillText("and whenever it hits a wall it will switch directions! Good Luck!", 30, 475);
		
		ctx.fillText("Press space to begin level 1!", 350, 550);
	} // if 
	
	// if space is pressed
	if (myKey && myKey == 32 && !spaceIsPressed && !isPlay){
		
		// if it"s the title page
		if (level == 0) {
			
			// changes to instructions
			level++;
			
			// stops button from triggering multiple times
			spaceIsPressed = true;
			
		} else {
			
			// if on instruction
			if (level == 1 && !myHorse) {
				
				myHorse = true;
				
				level++;
			} // if 
			
			// if on the first level
			if (level == 2) {
				
				// reset hearts
				hearts = 5;
			} // if 
			resetVars();
			isPlay = true;
			spaceIsPressed = true;
		} // if 
	} // if 
	
	// if you won or lost
	if (isWin || isLose || isFinish) {
		
		isPlay = false;
		
		// display lightbox
		ctx.fillStyle = "rgba(0,0,0,0.4)";
		ctx.fillRect(0, 0, c.width, c.height);
		
		// print message
		ctx.font = "30px Arial"; 
		ctx.fillStyle = "white";
		
		// if you win
		if (isWin) {
			ctx.fillText("Congratulations! You beat level " + (level - 1) + "!", 280, 200);
			ctx.fillText("Press space to begin level " + (level) + "!", 310, 250);
			
			// start next level
			level++;
			
		// if you lose
		} else if (isLose) {
			ctx.fillText("Oh no! You lost on level " + (level - 1) + "!", 310, 200);
			ctx.fillText("Press space to restart from level 1!", 250, 250);
			level = 2;
		
		// if you beat the game
		} else if (isFinish) {
			ctx.fillRect(0,0,c.width,c.height);
			ctx.fillStyle = "black";
			ctx.drawImage(myWin, (c.width - 500) / 2, -150, 500, 300);
			ctx.fillText("Congratulations! You've collected all of the carrots!", 160, 200);
			ctx.fillText("Press space to play again!", 330, 500);
			ctx.drawImage(myTrophy, (c.width - 200) / 2, 250, 200, 200);
			level = 2;
		} // if 
		
		// reset variables
		isWin = false;
		isLose = false;
		isFinish = false;
	} // if 
	
	// if the game is playing
	if (isPlay) {

		// creates gravity, and causes accelleration when falling
		// https://www.youtube.com/watch?v=8uIt9a2XBrw
		horse.speedY += 0.3; 
		
		// change canvas background colour
		c.style.background = "#f6c3c3";
		
		// is space is pressed
		if (myKey && myKey == 32 && !spaceIsPressed && horse.bottom >= groundLevel){
			
			// makes horse jump
			// https://www.youtube.com/watch?v=8uIt9a2XBrw
			horse.speedY = -7.6;
			
			spaceIsPressed = true;
		} // if 
		
		// if the horse is alive
		if (!horse.dead) {
			
			// if horse is on the ground
			if (horse.bottom >= groundLevel) {
				
				// makes horse move laterally
				horse.x += (horse.isRight)? 3.6 : -3.6;
			} else {
				
				// makes horse move slower when jumping
				horse.x += (horse.isRight)? 3 : -3;
			} // if 
		} // if 
		
		// if horse touches carrot
		if (carrot.exist && collision (carrot)) {
			
			// increment amount of carrots grabbed
			carrotsGrab++;
			
			// if horse has grabbed 3 carrots
			if (carrotsGrab == 3) {
				
				if (level == 11) {
					isFinish = true;
				} else {
					// you win
					isWin = true;
				}
			} // if 
			
		// if horse lands on top of dog
		} else if (horse.right > dog.left && horse.left < dog.right && horse.bottom < dog.roof && horse.bottom + horse.speedY > dog.roof && !horse.dead) {
			
			// horse defeats dog
			dog.dead = true;
		
		// if horse lands on top of bird
		} else if (horse.right > bird.left && horse.left < bird.right && horse.bottom < bird.roof && horse.bottom + horse.speedY > bird.roof && !horse.dead) {
			
			// horse defeats bird
			bird.dead = true;
			
		// if the horse isn"t already hurt
		} if (!horse.hurt) {
			
			// tests for whether the horse collides with an obstacle. if it does, the horse becomes hurt.
			// if horse touches rock
			if (rock.exist && collision (rock)) {
			
				horse.hurt = true;	
				
			// if horse touches bird
			} else if (bird.exist && collision(bird)) {
				
				horse.hurt = true;	
			
			// if horse touches dog
			} else if (dog.exist && collision(dog)) {
			
				horse.hurt = true;	
			} // if 
		} // if 
		
		// if horse touches water
		if (water.exist && horse.left > water.left && horse.right < water.right && horse.bottom > c.height - calc(groundHeight, 15)) {
				
				if (!horse.hurt){
					horse.hurt = true;
				}
				horse.first = true;
		} // if 
		
		// switches way horse is facing
		// if horse hits left wall
		if (horse.left < 0) {
			horse.isRight = true;
			
		// if horse hits right wall
		} else if (horse.right > c.width){
			horse.isRight = false;
			
		// if horse hits left side of a short landform
		} else if (shortLandform.exist && reboundLeft(shortLandform, horse)) {
			horse.isRight = false;
			
		// if horse hits right side of a short landform
		} else if (shortLandform.exist && reboundRight(shortLandform, horse)) {
			horse.isRight = true;
			
		// if horse hits left side of a tall landform	
		} else if (tallLandform.exist && reboundLeft(tallLandform, horse)) {
			horse.isRight = false;
			
		// if horse hits right side of a tall landform	
		} else if (tallLandform.exist && reboundRight(tallLandform, horse)) {
			horse.isRight = true;
			
		// if horse hits right side of water
		} else if (water.exist && horse.left <= water.left && horse.bottom > c.height - calc(groundHeight, 19)) {
			horse.isRight = true;
			
		// if horse hits left side of water
		} else if (water.exist && horse.right >= water.right && horse.bottom > c.height - calc(groundHeight, 19)) {
			horse.isRight = false;
		} // if 
		
		// if there"s a bird
		if (bird.exist) {
			
			// move bird right or left
			bird.x += (bird.isRight)? 3.6 : -3.6;
			
			// bounce bird off of left wall
			if (bird.x <= 0) { 
				bird.isRight = true;
				
			// bounc bird off of right wall
			} else if (bird.right >= c.width) {
				bird.isRight = false;
				
			// bounce bird off of left side of tall landform
			} else if (tallLandform.exist && reboundLeft(tallLandform, bird)) {
				bird.isRight = false;
				
			// bounce bird off of right side of tall landform
			}  else if (tallLandform.exist && reboundRight(tallLandform, bird)) {
				bird.isRight = true;
			}
			
		} // if 
		
		// if there"s a dog
		if (dog.exist) {
			
			// makes the dog bounce off of obstacles
			// if it hits the left side of the screen
			if (dog.left <= 0) {
				dog.isRight = true;
				
			// if it hits the right side of the screen
			} else if (dog.right >= c.width) {
				dog.isRight = false;
				
			// if it hits left side of short landform
			} else if (shortLandform.exist && reboundLeft(shortLandform, dog)) {
				dog.isRight = false;
				
			// if hits right side of short landform
			} else if (shortLandform.exist && reboundRight(shortLandform, dog)) {
				dog.isRight = true;
				
			// if hits left side of tall landform
			} else if (tallLandform.exist && reboundLeft(tallLandform, dog)) {
				dog.isRight = false;
				
			// if hits right side of tall landform
			} else if (tallLandform.exist && reboundRight(tallLandform, dog)) {
				dog.isRight = true;
				
			// if would fall into water from left
			} else if (water.exist && reboundLeft(water, dog)) {
				dog.isRight = false;
				
			// if would fall into water from right
			} else if (water.exist && reboundRight(water,dog)) {
				dog.isRight = true;
			} // if 
			
			// moves the dog right and left
			dog.x += (dog.isRight)? 3.6: -3.6;
			
		} // if 
		
		// Determines the lowest level that the horse can walk on based on what it"s on top of
		// if your on top of a short landform
		if (shortLandform.exist && horse.left < shortLandform.right && horse.right > shortLandform.left && horse.bottom <= shortLandform.roof) {
			
			// the lowest level the horse can walk is the top of the landform
			groundLevel = shortLandform.roof;
			
		// if your on top of a tall landform
		} else if (tallLandform.exist && horse.left < tallLandform.right && horse.right > tallLandform.left && horse.bottom <= tallLandform.roof) {
			
			// the lowest level the horse can walk is the top of the landform
			groundLevel = tallLandform.roof;
			
		// if horse is on water
		} else if (water.exist && horse.left > water.left - 2 && horse.right < water.right + 2) {
			
			// the lowest level the horse can walk is the top of the water, causes falling
			groundLevel = water.bottom;
			
		} else {
			
			// the lowest level the horse can walk is the ground
			groundLevel = c.height - calc(groundHeight, 20);

		} // if 
		
		// if there"s a platform
		if (platform.exist) {
			for (i in platform.roof) {
				
				// if horse is on the edge platform
				if (horse.left < platform.right[i] - 1 && horse.right > platform.left[i] + 1 && horse.bottom < platform.roof[i]) {
					
					// stops issues caused when a platform is over top of a landform
					platform.on = i;
					
				// if the horse is on the platform
				} else if (platform.on == i) {
					
					// if horse is runs off the edge platform
					if (horse.left >= platform.right[platform.on] - 1 || horse.right <= platform.left[platform.on] + 1) {
						
						platform.on = -1;
					} // if 
				} // if 
				
				// if horse is on the platform
				if (platform.on == i) {

					// changes the lowest level that the horse can run on
					groundLevel = platform.roof[i];
					break;
				} // if 
			} // for
		} // if 
		
		// Makes the horse fall
		// https://www.youtube.com/watch?v=8uIt9a2XBrw
		horse.y += horse.speedY ;
		
		// if the horse falls past the ground, it changes so that it"s on the ground
		// https://www.youtube.com/watch?v=8uIt9a2XBrw
		if (horse.y > groundLevel - horse.size && hearts != 0) {
			horse.y = groundLevel - horse.size;
			horse.speedY = 1;
		} // if 
		
		// clear screen
		clear();
		
		// draw hearts
		if (hearts == 0) {
			horse.dead = true;
		} else {
			for (var i = 0; i < hearts; i++) {
				ctx.drawImage(myHeart, 20 + 50 * i , 50, 40, 40);
			} // for
		} // if 
		
		// diplay level
		ctx.fillStyle = "black";
		ctx.font = "30px Ariel";
		ctx.fillText("Level " + (level - 1),20,40);
		
		// draw ground
		ctx.drawImage(myGround, 0, c.height - groundHeight, c.width, groundHeight);
		
		carrot.exist = false;
		
		// changes scene depending on level
		switch (level) {
			
			// level 1: short landform, rock, horse, carrot
			case 2:
			
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(800, c.height - calc(groundHeight, 20));
				} else if (carrotsGrab == 1) {
					carrot.draw(10, c.height - calc(groundHeight, 20));
				} else if (carrotsGrab == 2) {
					carrot.draw(shortLandform.left, 320);
				} // if 
				
				// draw rest of obstacles
				shortLandform.draw(600);
				rock.draw(500, c.height - calc(groundHeight, 30));
				horse.draw(10);
				break; 
				
			// level 2: short landform, tall landform, bird, horse, carrots
			case 3:
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(800, c.height - calc(groundHeight, 20) - 2.2 * horse.size);
				} else if (carrotsGrab == 1) {
					carrot.draw(10, c.height - calc(groundHeight, 36));
				} else if (carrotsGrab == 2) {
					carrot.draw(500, c.height - calc(groundHeight, 20) - 2.2 * horse.size);
				} // if 
				
				// draw rest of obstacles
				shortLandform.draw(300);
				tallLandform.draw(500);
				bird.draw(100,320);
				horse.draw(10);
				break;
			
			// level 3: 3 platforms, dog, bird
			case 4:
				
				// declares all new platforms
				if (!platform.declare) {
					platform.newPlatform(200,290);
					platform.newPlatform(400,190);
					platform.newPlatform(600,290);
					platform.declare = true;
				} // if 
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(platform.left[1],platform.roof[1]);
				} else if (carrotsGrab == 1) {
					carrot.draw(platform.left[0],platform.roof[0]);
				} else if (carrotsGrab == 2) {
					carrot.draw(platform.right[2],platform.roof[2]);
				} // if 
				
				// draw rest of obstacles
				platform.draw();
				horse.draw(10);
				dog.draw(500);
				bird.draw(100,330);
				break;
				
			// level 4:	tall landform, rock, short landform
			case 5:
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(0,c.height - calc(groundHeight, 20));
				} else if (carrotsGrab == 1) {
					carrot.draw(0,300);
				} else if (carrotsGrab == 2) {
					carrot.draw(tallLandform.left, 250);
				} // if 
				
				// draw rest of obstacles
				tallLandform.draw(90);
				rock.draw(280, c.height - calc(groundHeight, 30));
				shortLandform.draw(390);
				horse.draw(800);
				break;
				
			// level 5: 2 platforms, rock, dog, tall landform, short landform
			case 6:
				
				// declares all new platforms
				if (!platform.declare) {
					platform.newPlatform(220,200);
					platform.newPlatform(450,120);
					platform.declare = true;
				} // if 
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(platform.right[1], platform.roof[1]);
				} else if (carrotsGrab == 1) {
					carrot.draw(platform.left[0], platform.roof[0]);
				} else if (carrotsGrab == 2) {
					carrot.draw(tallLandform.left, 250);
				} // if 
				
				// draw rest of objects
				tallLandform.draw(0);
				shortLandform.draw(600);
				rock.draw(shortLandform.left + 40, c.height - calc(groundHeight, 35));
				platform.draw();
				dog.draw(200);
				horse.draw(800);
				break;
				
			// level 6: 2 platforms, water, rock, dog
			case 7:
			
				// declares all new platforms
				if (!platform.declare) {
					platform.newPlatform(400, 290);
					platform.newPlatform(200, 220);
					platform.declare = true;
				} // if 
				
				// draw water
				water.draw(500);
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(800,c.height - calc(groundHeight,20));
				} else if (carrotsGrab == 1) {
					carrot.draw(10, c.height - calc(groundHeight,20));
				} else if (carrotsGrab == 2) {
					carrot.draw(100, 250);
				} // if 
				
				// draws rest of obstacles
				platform.draw();
				rock.draw(water.right + 30, c.height - calc(groundHeight, 30));
				dog.draw(300);
				horse.draw(10);
				break;
				
			// level 7: water, tall landform, bird
			case 8:
				
				// draw water
				water.draw(300);
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(800, c.height - calc(groundHeight, 20));
				} else if (carrotsGrab == 1) {
					carrot.draw(water.left, c.height - calc(groundHeight, 20));
				} else if (carrotsGrab == 2) {
					carrot.draw(tallLandform.left, 250);
				} // if 
				
				// draw rest of obstacles
				tallLandform.draw(600); 
				bird.draw(500,320);
				horse.draw(10);
				break;
				
			// level 8: 4 platforms, water, tall landform, rock, dog
			case 9:
			
				// declares all new platforms
				if (!platform.declare) {
					platform.newPlatform(770, 200);
					platform.newPlatform(530, 120);
					platform.newPlatform(250, 80);
					platform.newPlatform(40, 220);
					platform.declare = true;
				} // if 
				
				// draw water
				water.draw(670);
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(platform.right[3] - 20, platform.roof[3]);
				} else if (carrotsGrab == 1) {
					carrot.draw(water.left, c.height - calc(groundHeight,20));
				} else if (carrotsGrab == 2) {
					carrot.draw(tallLandform.left, 250);
				} // if 
				
				// draw rest of obstacles
				platform.draw();
				tallLandform.draw(490);
				dog.draw(100);
				rock.draw(platform.left[3] + 1, platform.roof[3] - rock.height / 11 * 10);
				horse.draw(0);
				break;
				
			// level 9: short landform, tall landform, rock, water, bird, dog
			case 10:
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(900, c.height - calc(groundHeight,20));
				} else if (carrotsGrab == 1) {
					carrot.draw(620, 320);
				} else if (carrotsGrab == 2) {
					carrot.draw(10,330);
				} // if 
				
				// draw other objects
				shortLandform.draw(100);
				tallLandform.draw(700);
				rock.draw(150, c.height - calc(groundHeight, 35));
				water.draw(400);
				bird.draw(890, 350);
				dog.draw(500);
				horse.draw(10);
				break;
				
			// level 10: 1 platform, tall landform, short landform, rock, water
			case 11:
			
				// declares all new platforms
				if (!platform.declare) {
					platform.newPlatform(200, 200);
					platform.declare = true;
				} // if 
				
				// spawns carrots based on how many carrots have been grabbed
				if (carrotsGrab == 0) {
					carrot.draw(900, 350);
				} else if (carrotsGrab == 1) {
					carrot.draw(0, 320);
				} else if (carrotsGrab == 2) {
					carrot.draw(platform.right[0],platform.roof[0]);
				} // if 
				
				// draw other obstacles
				shortLandform.draw(820);
				platform.draw();
				water.draw(520);
				rock.draw(water.right + 20, c.height - calc(groundHeight, 30));
				tallLandform.draw(0);
				horse.draw(160);
				break;
		} // switch
		
		frameNo++;
	} // if 
} // drawScene

// clears the canvas
function clear () {
    ctx.clearRect(0, 0, c.width, c.height);
} // clear

// The ground is a 128 px by 128 px image. This function helps to calculate image sizes relative to the ground.
function calc (val, multi) {
	return (val / 128 * multi);
} // calc

// resets variables in between levels
function resetVars () {
	horse.resetHorse(c.height - calc(groundHeight, 20),10);
	platform.resetPlatform();
	
	bird.isRight = true;
	dog.isRight = true;
	carrotsGrab = 0;
	bird.roof = 0;
	bird.first = true;
	dog.y = 0;
	dog.first = true;
	
	shortLandform.exist = false;
	rock.exist = false;
	bird.exist = false;
	dog.exist = false;
	tallLandform.exist = false; 
	water.exist = false;
	platform.exist = false;
	heart.first = true;
} // resetVars

// determines if the horse has collided with an object
function collision (obstacle) {
	if (myHorse && horse.right > obstacle.left && horse.left < obstacle.right && horse.bottom > obstacle.roof && horse.roof < obstacle.bottom){
		return true;
	} // if 
	return false;
} // collision

// determines if an object has hit the left side of an obstacle
function reboundLeft (object, character) {
	if (myHorse && character.right >= object.left && character.left < object.left && character.bottom > object.roof) {
		return true;
	} // if 
	return false;
} // reboundLeft

// determines if an object has hit the right side of an obstacle
function reboundRight (object, character) {
	if (myHorse && character.left <= object.right && character.right > object.right && character.bottom > object.roof) {
		return true;
	} // if 
	return false;
} // reboundRight