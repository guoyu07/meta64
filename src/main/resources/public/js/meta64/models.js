var PropEntry = (function () {
    function PropEntry(id, property, multi, readOnly, binary, subProps) {
        this.id = id;
        this.property = property;
        this.multi = multi;
        this.readOnly = readOnly;
        this.binary = binary;
        this.subProps = subProps;
    }
    return PropEntry;
}());
var SubProp = (function () {
    function SubProp(id, val) {
        this.id = id;
        this.val = val;
    }
    return SubProp;
}());
var NodeInfo = (function () {
    function NodeInfo(id, path, name, primaryTypeName, properties, hasChildren, hasBinary, binaryIsImage, binVer, width, height, childrenOrdered) {
        this.id = id;
        this.path = path;
        this.name = name;
        this.primaryTypeName = primaryTypeName;
        this.properties = properties;
        this.hasChildren = hasChildren;
        this.hasBinary = hasBinary;
        this.binaryIsImage = binaryIsImage;
        this.binVer = binVer;
        this.width = width;
        this.height = height;
        this.childrenOrdered = childrenOrdered;
    }
    return NodeInfo;
}());
var PropertyInfo = (function () {
    function PropertyInfo(type, name, value, values, htmlValue) {
        this.type = type;
        this.name = name;
        this.value = value;
        this.values = values;
        this.htmlValue = htmlValue;
    }
    return PropertyInfo;
}());
//# sourceMappingURL=models.js.map