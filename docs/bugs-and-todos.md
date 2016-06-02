# Technical Debt
* We have several places in the code where we do something like delete nodes, etc, and we are going back to the server to refresh the page, when really the client-side has enough information to refresh the page without going back to server, but it takes additional work. Waiting for the feature set to become more stable before attacking these kinds of performance optimizations.

# TODO
* need 'delete account' capability where user can leave meta64, and have all their data deleted from the server.
* after changing edit mode (simple/advanced) need to refresh entire page from server
* on search results screen, need a button to directly edit a node from there.
* For nodes that are shared, they should be indicated in some obvious way to the user, without having to go to sharing page to check. The challenge here may be a performance one, because if any kind of query is required the over head is not going to justify this.
* Need change email address feature. Just like existing change password feature.
* SEO (Search Engine Optimization): Need to make home page detect Google web crawler, and expose urls that include mainly the home page of meta64 content but also allows WebCrawling of **one** page per user, and have a standard of like **/user/home** being the folder that users can create that will be 'searchable' on google.
* Admin console that shows free memory statistics, connection info, number of logged in users, disk space consumption specifically in the DB storage folder, etc.
* Some way to let user render text at a narrower width across the page. Lines going completely across a wide screen are hard to read - at least on a wide screen device
* Need "Move to Top" and "Move to Bottom" in addition to "up"/"down"
* More JUnit unit tests.
* If user spends a very long time editing a node without saving, and the session times out they can lose ability to save. Need intermittent save to a property like "content-unsaved" so that when they open the editor, the next time we can detect this, and ask them if they would like to continue editing their unsaved work.
* I took away the auto-selecting of newly inserted nodes. Cursor stays as current parent, or sibling. Changed my mind and I think highlighting it is best!

# List of Known Bugs
* password cookie key will be encrypted using AES from http://point-at-infinity.org/jsaes/, probably and probably the https://panopticlick.eff.org/ methodology of generating a string to use for the encryption key which will be rather unique to the machine. This means if a hacker gets your cookie, it will still be difficult to decrypt, unless they can also run javascript on your machine and sent the output to their servers. Of course a hacker can lure you to their server, where they can run JS on a page and get your panopticlick info, but that is one additional challenge for them.
