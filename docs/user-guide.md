#These are just the beginnings of some notes I'll eventually put in a user guide. This file
is not an actual user guide


## End User and Admin Info

This document will currently just contain information about how to use the app from a high-level perspective. I haven't really written much yet as you can see.


## Image on the page upper right corner:

Any node can optionally have the following which will always cause the specified image to be rendered at the upper right corner of the display of that node every that node is ever displayed.

    property: img.top.right
    value: URL of image


## Set Background image on Node:

    property: img.node.bkg
    value: URL of image

## Markdown Tips

To display an image:
	![Eat Apple Pie] (https://upload.wikimedia.org/wikipedia/commons/4/4b/Apple_pie.jpg)

## Rapid Note Taking Feature

There is an 'Add Node' feature that allows a url such as the following to be able to be used to add a node immediately and let you start editing it immediately when the browser loads. So if user Bob had a node of the specified path '/bob/my-notes', for example, he could create a Bookmark
to this url in his browser, and it will allow him to immediately start typing a new note simply by going to the url. This means litterally just
the one click on the Bookmark is all that's required to take a new note. Then you just type the note content, and click save.

	http://meta64.com/?id=/bob/my-notes&cmd=addNode

