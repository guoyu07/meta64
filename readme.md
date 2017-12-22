## SubNode 'readme.md' technical content is here...

http://sbnode.com?id=/r/public/home

## A nifty little RSS Feed (with a couple of podcasts)

http://www.sbnode.com/?id=/r/public/feeds

## IMPORTANT (Date: 12/2017): 

This project is moving away from Google Polymer and onto React+Bootstrap4. I have been doing the work without any 
checkins recently into this GitHub project, but am very close to having Polymer completely removed. 

## Adding ReactJS Next (Date: 11/2017)

Most of the tech notes are not in this readme, but i'm putting this ReactJS note here for the few
people following this project: I have completed a test (see ButtonBarRe.tsx, ButtonRe.tsx, and HeaderRe.tsx)
of how ReactJS can integrate into this app without causing any significant redesign. It turns out the 
Widget system already in place can sit on top of ReactJS very easily because it was already doing the same kind 
of composition that ReacJS does. So i'm checking in the code now with this ReactJS test in place (in the Login Dialog 
as the place where it was Reactified), however the next thing I'll do is put in place a more standard build process, 
and will be trying out WebPack.
