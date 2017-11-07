# How to Setup RSS Feeds in SubNode

* Create Reposotry node at: /r/public/feeds. All Feeds must be defined under this node. Will be publicly visible because you should also have /r/public setup to have public access ACL.

* You can organize any structure under the /r/public/feeds node you want. Any tree structuring under that is up to you.

* To add an RSS feed create a node of type "sn:rssfeed", and add just one property to it manually which will be the "sn:rssFeedSrc", which will contain the URL of the actual RSS feed xml itself. All "rssfeed" nodes contained anywhere under the subgraph rooted at 'publi/feeds' will be found and processed whenevery you run menu item "Admin->RSS Feeds"

* That's basically all the steps running the admin menu item processes the feeds:

# More about RSS Processing

* The RssService has a daemon method (Spring @Scheduled) which runs at regular intervals that will update all the rss feeds. 


