# Getting Started (Baby Steps)

## Compile Code
* Download Eclipse IDE for EE develpers

* Download and upzip meta64 code.

* Open Eclipse and do "Import -> Existing Maven Project"
  Should result in application building right away with no further steps

## Public Commenting on Nodes

* Sharing dialog allows you to specify "Public Commenting" for a node meaning that not only is the node visible to everyone but also everyone is allowed to add subnodes. Chaos will ensue and it shall be fun!

* Here's how it's implemented: GUI checkbox turns it on by calling server addPrivilege with publicAppend=true, this simply causes a property to get set on the node like so:
node.setProperty(JcrProp.PUBLIC_APPEND, true);

* Actually at the time of this writing the checkbox isn't working, but you can manually add a node named publicAppend and set it to 'true'
