# FloorScore
Basic JavaScript-driven scoreboard, designed for floorball.

**FloorScore** is a lightweight browser-based scoreboard, designed primarily 
for use by [Floorball ACT](https://www.floorballact.org.au) for their local competitions. 
However, it could be easily used/adapted for other sports.

## Installation

Simply pull the repository to a location of your choice on your hard drive. You can run the 
system directly from disk. **However**, this is only known to work with Firefox, and other
browsers typically have cross-server issues. If this is the case, you may need to run
a lightweight web server from the directory you pulled the repository to 
(e.g. `python -m http.server` or equivalent).

## Scoreboard types

There are two major scoreboard types:

* **standard** - This is designed for 'normal' games;
* **rolling** - This is for large, multi-court 'carnival' events, where only a timer is needed
  (no scores), and multiple games (including a warm-up period) flow one after another.
  
To start the scoreboard you wish to use, open the corresponding HTML file. You don't need
to open the `*-screen.html` files directly; these will appear if you hit the "Open
External Display" button in the control window (and won't work properly if you don't).

## Repository structure

As expected, `master` is the current stable branch. External users wishing to fork/use the 
system should do so from `master`, unless they wish to work on a particular feature branch.
The `master` branch comes with a standard set of "colour" teams.

Speaking of branches, there are two types in this repository:

* Feature branches are just as you would expect, being used to build/improve features 
  (e.g. `period-blocks` is used to work on the display of the current period);
* We use tournament branches (e.g. `FACT-SS2020-21`) for each Floorball ACT league
  or competition. These branches are functionally identical to `master`, but contain
  a custom team list for that particular competition.
  
## How it works

### Timing

The timing uses [tock.js](https://github.com/Falc/Tock.js). This module implements a countdown timer 
which updates itself by polling the system clock, meaning there isn't significant time drift (as
opposed to trying to use internal JavaScript timers).

### Sounds

Sounds are played using [lowLag.js](https://github.com/kirkjerk/lowLagAudio). This prevents the 
large delays involved in playing sounds in vanilla JavaScript/HTML5 (otherwise, the buzzer would
sound up to several seconds after the clock hit 0:00).

### Inter-window communication

By having the control window open the display screen, MutationObservers on the display screen 
can monitor the control window for changes in the current time, current period number, etc. These
changes are then instantly re-formatted and re-displayed on the large display window.
