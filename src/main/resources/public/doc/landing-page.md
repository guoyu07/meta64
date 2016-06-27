## Meta64: Open-Source CMS/Portal

Meta64 is an Open Source "Mobile First" Wiki-type content repository (or CMS) built on Apache Oak JCR and MongoDb back-end (on Java SpringBoot), with Google Polymer-based front-end. The meta64.com website itself is running an instance of the meta64 portal software. In other words, this is not just documentation *about* meta64, but it *actually is* a meta64 node that you are now viewing.

The **meta64.com** website is currently geared towards the web developer audience, and the development of the platform; but the technology itself is a platform for building portals. This "Portal Platform" allows users to signup and create accounts where they can host content. The content can be any kind of text, data, images, and/or binaries, and can be shared to other users, who can then browse and/or edit the content collaboratively. The goal is to create a portal that is somewhat similar to Wikipedia (collaborative editing and sharing), but having many Social Media-types of capabilities. Another goal, from a technology standpoint, was to use only content repository open-standards for data, open source APIs, highly scalable data storage, and a very modern Mobile front end.

## News: Recent Changes 

All JavaScript is now in the form of TypeScript! This is a major advancement for the application, and allows perfect type-safety in all JavaScript so that even so much as a misspelled variable name will get detected at build time rather than runtime! Already is having a massive positive impact on quality.

## Technology Stack
* Web App: Google Polymer (Web Components), TypeScript/JavaScript, JQuery, JSON/Ajax, Ace Editor, Pegdown Markdown
* Server: Java, SpringBoot, Apache Oak JCR, Lucene, MongoDb, Tomcat Embedded

## Links
[GitHub Main Page](https://github.com/Clay-Ferguson/meta64)   
[GitHub Docs](https://github.com/Clay-Ferguson/meta64/tree/master/docs/)   
[Browse Demo Content (Book: War and Peace)](http://www.meta64.com/?id=/meta64/war-and-peace)   

## Meta64 Overview
Meta64 is at it's core a **Content Repository Browser**, or an app for interacting with hierarchical data. The website you are now reading (if you're on meta64.com) is actually running this portal, and makes up everything you are seeing. The technology however is much more than a Content Browser, because it presents a GUI front end appropriate to both non-technical users, as well as the more technical users of back-end content repositories. The theory here is that *"everything is content"* and since both end users and technical users need to be able to interact with hierarchical data stores, it's desirable to have one system architecture that serves both roles well.

The meta64 website and content on it is now geared towards the developer and is online as a demonstration of platform, but the ultimate goal is to provide capabilities very similar to Facebook, Reddit, and Wikipedia, etc. if you could imagine them all rolled into one system. With the power of Lucene and MongoDB on the backend, plus the fully standards-based open stack, this only 4-month old codebase is already able to provide incredible power only found in other commercial content repositories that are proprietary products, which are also mostly built on much older technology stacks.

For a social media user, meta64 can function as a blogging platform, file-sharing platform, social commenting platform, wiki system, personal website host, etc., while simultaneously functioning as a full-blown back-end JCR repository used by technical users like software developers, data architects, DB admins, etc. The way this is accomplished is by having a simplified set of features (i.e. rendering of the GUI) presented to non-technical users, while having the full featured JCR browser capabilities available at the flip of a switch, using a single button click. There is a 'simple' mode and 'advanced' mode, that does this.

There are just a few key concepts to know for a basic understanding of what JCR is all about, if you aren't familiar with the term:

### Key Concepts

* Everything is content: Text, images, file attachments, etc. are individual content nodes.
* JCR is a Content Repository (database) standard for Java.
* Data exists as a tree structure consisting of editable nodes.
* Each user owns a part of the tree and all subnodes under that make up their "account root".
* Node text and attachments can be edited (like on a Wiki)
* Markdown is used to do formatting of the nodes when displayed.
* Each node can be shared by its owner to the public or to specific users.
* Nodes can be created, edited, moved, and deleted just like in a file system.
* Any type of binary content can be uploaded onto nodes, and attached images show up as part of the page.
* Each node can be referenced by direct-linking to it on the URL, so users can publish their own pages with specific urls.
* Essentially meta64 itself is a kind of tree-structured wiki, or just a tree of editable, sharable content, just like you see on social media, but completely general purpose.

## Source Code
The code is "Open Source" (and on GitHub) but still pre-alpha prototype currently, meaning it's not considered production ready, but does follow architectural best practices. The project is currently being managed and developed by Clay Ferguson (author of this document). I'm actively developing meta64 nearly every day, and looking for other interested developers to join the effort.

## List of Features

* Basic JCR Browsing capability
* Login/Logout
* Auto-login using Cookies
* Signup new users (including captcha, and password)
* Signup process includes email receipt verification
* Social Media Buttons for Login (Twitter, etc)
* Node editing (plain text/markdown)
* Orderable child nodes ("move up" and "move down" supported)
* Creating Subnodes or Inline nodes
* Full Text Search and/or Tag-based searches (by Lucene)
* Timeline feature: Reverse Chronological list of any tree branch.
* Deleting Nodes
* Moving nodes to new locations (supports multi-select)
* Renaming Nodes
* Sharing a node as Public
* Sharing a node to a specific User
* Display of All Shared Nodes (under any branch)
* Social Media-type Public Commenting (providing conversation under any node)
* Removing individual Share privileges from nodes
* Short URL GUID for any node, so it can be referenced by URL
* Sends email notification when someone creates a new node under a node you own.
* Uploading attachments (attached files) onto a node
* Image Attachments automatically display in the content, anywhere you specify.
* Upload from local machine
* Upload directly from any internet URL.
* Deleting node attachments
* Renders image attachments on the page (on the node)
* Shows JCR properties for nodes.
* Allows editing of properties (single value and multi-valued)
* Creating/Deleting new JCR node properties
* Can switch between simple or advanced mode editing
* Change password feature.
* Multiple nodes selectable
* Import/Export to XML (admin only)
* Admin feature to insert entire book "War and Peace", for quickly
  creating test data for exploring all the features, and especially 'search'.
* Smart dynamic image sizing. Images are sized to look best on your device regardless of screen size or orientation.
* Soft "Branding". Can rebrand portal by a properties file entry. Includes Search Engine Optimization text.
* Admin Info Dialog: Shows Free Memory, IPs of all browsers, number sessions active, etc.
* For future planned features see file: **/docs/bugs-and-todos.md**

## Technology Stack and APIs

* Single Page Application (SPA)
* JavaScript/HTML/CSS Client
* All JavaScript, coded as TypeScript
* JSON-Ajax for Server Communication
* Google Polymer - Web Components (https://www.polymer-project.org/1.0/)
* MongoDB as Data Storage (https://www.mongodb.com)
* Apache Jackrabbit Oak, for JCR interface (https://jackrabbit.apache.org/oak/)
* Spring MVC, SpringBoot (http://projects.spring.io/spring-boot/)
* App is "Mobile First", meaning a primary objective is to run well on mobile
* Using Google Closure Compiler for JS Minification (https://developers.google.com/closure/compiler/)
* Pure Java on Server (https://www.oracle.com/java/index.html)
* Markdown support provided by PegDown (https://github.com/sirthias/pegdown)
* Google Code Prettifier (https://github.com/google/code-prettify)
* Ace Editor for code editing (https://ace.c9.io/#nav=about)
* Built using Maven (https://maven.apache.org/)
* Bower Package Manager (http://bower.io/)
* Launches from a single SpringBoot "uber jar" containing Tomcat embedded and pre-configured
* Spring Java-only configuration with Annotations, and no XML configs.

## Apache Jackrabbit Oak
Other than SpringBoot, the main dependency needed for running/building meta64 is Jackrabbit Oak. This project is currently being hosted here:

https://github.com/apache/jackrabbit-oak   
https://jackrabbit.apache.org/oak/docs/index.html

Jackrabbit Oak is an Adobe-sponsored Open Source project for creating the best world class JCR implementation. It is extremely high performance and hugely scalable largely due to Lucene as the search technology in use, and also because of MongoDB. As with any "NoSQL" the primary concern is indeed performance and scalability so the ACID transactions of an RDBMS are sacrificed for the "eventually consistent" model offered by a NoSQL approach.

## Technical Notes
* To build the app use maven.
* You need to understand 'spring boot'
* See application-*.properties files for configurations.
* Pre-requisites: Java VM installed on machine, and MongoDB server up and running, with a database named 'meta64'
* Currently uses default storage location for MongoDb
* Once app is up and running go here: http://localhost:8083 (8083 port is currently the DEV profile port)     
* Refer to the 'docs' folder of the project for additional technical documentation.

## About the Developer
Meta64 is a FOSS (Free Open Source Software) project created by Clay Ferguson. I'm a 48 yr old Java Developer living in Dallas. I have 25 years of coding experience consisting of 10yrs of C++ followed by 15 years of Java, and primarily on Web Apps.

**linkedin.com:** http://www.linkedin.com/in/wclayf  
**GitHub:** https://github.com/Clay-Ferguson  
**email:** wclayf@gmail.com  
