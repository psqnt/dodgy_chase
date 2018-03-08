# Dodgy Chase

This is a 2 to 4 player multiplayer game.

I have deployed it and tested it using heroku. It is buggy but it does work.

You can see it and play it here as of 3/8/2018.
https://immense-river-57755.herokuapp.com/


Follow instructions on heroku to deploy it and play it with others as I am not able to run a server full time.

or download it and test it on localhost.

## Starting a game
Two clients must click the 'Find Game' button, then a game screen will appear. Only one player should press the start game button and a game will start.

If other players press the "Find Game" button with a game going on they will be placed into the existing game.

## Known Bugs
After a game is started, when the start game button is pressed again the speed of the game doubles.

I will assume this happens because another setInterval game loop starts.
