var indices =
{
    "Head": 0,
    "Neck": 1,

    "RightUpperArm": 2,
    "RightLowerArm": 3,

    "UpperBody": 4,

    "LeftUpperArm": 5,
    "LeftLowerArm": 6,

    "LowerBody": 7,

    "LeftUpperLeg": 8,
    "LeftLowerLeg": 9,

    "RightUpperLeg": 10,
    "RightLowerLeg": 11,

    "Foot": 12,

    "RightHolding": 13
};

class PartCoverages {
    constructor(partCoverages) {
        this.coverages = partCoverages.coverages;
        this.frontFace = partCoverages.frontFace;
    }

    static nameOf(i) {
        return PartCoverages.names[i];
    }

    static indexOf(name) {
        return PartCoverages.indices[name];
    }

    isContained(coverageIdx) {
        return (this.coverages & (1 << coverageIdx)) != 0;
    }

    isFrontFace() {
        return this.frontFace;
    }

    setFrontFace() {
        this.frontFace = true;
    }

    setBackFace() {
        this.frontFace = false;
    }

    add(coverageIdx) {
        this.coverages = this.coverages | (1 << coverageIdx);
    }

    remove(coverageIdx) {
        this.coverages = this.coverages & (~(1 << coverageIdx));
    }

    isContainedByName(coverageName) {
        return (this.coverages & (1 << PartCoverages.indices[coverageName])) != 0;
    }

    addByName(coverageName) {
        this.coverages = this.coverages | (1 << PartCoverages.indices[coverageName]);
    }

    removeByName(coverageName) {
        this.coverages = this.coverages & (~(1 << PartCoverages.indices[coverageName]));
    }

    getContainedIndices() {
        var rval = [];
        for (var i = 0; i < PartCoverages.names.length; i++) {
            if (!this.isContained(i))
                continue;

            rval.push(i);
        }

        return rval;
    }

    getContainedNames() {
        var rval = [];
        for (var i = 0; i < PartCoverages.names.length; i++) {
            if (!this.isContained(i))
                continue;

            rval.push(PartCoverages.names[i]);
        }

        return rval;
    }

    isFrontFace() {
        return this.frontFace;
    }

    overlapped(other) {
        return getOverlap(other) != 0;
    }

    getOverlap(other) {
        return this.coverages & other.coverages;
    }
};

class Part {
    constructor(rootPath, part) {
        this.rootPath = rootPath;
        this.name = part.name;
        this.clothTexturePath = part.clothTexturePath;
        this.x = part.x - (2048 - 1536) / 2;
        this.y = 2048 - part.y;
        this.w = part.w;
        this.h = part.h;
        this.partCoverages = new PartCoverages(part.partCoverages);

        this.sprite = new cc.Sprite(this.rootPath + this.clothTexturePath + ".png");
        this.sprite.setAnchorPoint(0.0, 1.0);
        this.sprite.setContentSize(this.w, this.h);
        this.sprite.setPosition(this.x, this.y);
    }

    getName() {
        return this.name;
    }

    getImagePath() {
        return this.clothTexturePath;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.w;
    }

    getHeight() {
        return this.h;
    }

    getPartCoverages() {
        return this.partCoverages;
    }

    getSprite() {
        return this.sprite;
    }
};

class ClothStyles {
    constructor(clothStyles) {
        this.styles = clothStyles.styles;
    }
};

class ClothOffset {
    constructor(clothOffset) {
        this.offset = clothOffset.offset;
    }
};

class Cloth {
    constructor(clothSet, rootPath, clothType, idx) {
        this.rootPath = rootPath;
        this.clothType = clothType;
        this.idx = idx;
        this.name = "";
        this.clothStyle = null;
        this.clothOffset = null;
        this.parts = [];

        var xhr = new XMLHttpRequest();
        var filename;
        if (idx)
            filename = rootPath + clothType + idx + ".json";
        else
            filename = rootPath + clothType + ".json";
        xhr.open("GET", filename, true);
        xhr.responseType = "json";
        xhr.onreadystatechange = function (clothSet, rootPath) {
            if (xhr.readyState === 4) {
                this.initialize(rootPath, xhr.response);
                this.attach(clothSet);
            }
        }.bind(this, clothSet, rootPath);
        xhr.send();
    }

    initialize(rootPath, cloth) {
        this.name = cloth.name;
        this.clothStyle = new ClothStyles(cloth.clothStyles);
        this.clothOffset = new ClothOffset(cloth.clothOffset);
        this.parts = this.initParts(rootPath, cloth.parts);
    }

    getParts() {
        return this.parts;
    }

    initParts(rootPath, partsJson) {
        var rvals = [];
        for (var i = 0; i < partsJson.length; i++) {
            rvals.push(new Part(rootPath, partsJson[i]));
        }

        return rvals;
    }

    attach(clothSet) {
        var clothOrder =
        {
            "body": 0,
            "sy": 1,
            "wz": 2,
            "xiaz": 3,
            "xiez": 4,
            "lyq": 5,
            "wt": 6,
            "fx": 7
        };

        for (var i = 0; i < this.parts.length; i++) {
            var isFrontFace = this.parts[i].getPartCoverages().isFrontFace();
            var sprite = this.parts[i].getSprite();

            if (isFrontFace)
                clothSet.addChild(sprite, 100 + clothOrder[this.clothType]*16);
            else
                clothSet.addChild(sprite, 100 - clothOrder[this.clothType]*16);
        }
    }

    detach(clothSet) {
        for (var i = 0; i < this.parts.length; i++) {
            var sprite = this.parts[i].getSprite();
            clothSet.removeChild(sprite);
            //sprite.removeFromParent();
        }
    }
}