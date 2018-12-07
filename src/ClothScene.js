var ClothSceneLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.addBG();
        this.initCloth();
        this.addMenu();
        
        return true;
    },

    addMenu: function () {
        var size = cc.winSize;

        this.mainMenu = new MainMenu
            (
            [
                "res/clothicons/zz/zz_fx.png",
                "res/clothicons/zz/zz_wt.png",
                "res/clothicons/zz/zz_lyq.png",
                "res/clothicons/zz/zz_sy.png",
                "res/clothicons/zz/zz_xiaz.png",
                "res/clothicons/zz/zz_wz.png",
                "res/clothicons/zz/zz_xiez.png",
            ]
            );

        this.fxSubMenu   = new SubMenu("res/clothicons/fx/"  , "iconfx"  , 0, 1, 187, this.changeCloth.bind(this));
        this.wtSubMenu   = new SubMenu("res/clothicons/wt/"  , "iconwt"  , 1, 1,  92, this.changeCloth.bind(this));
        this.lyqSubMenu  = new SubMenu("res/clothicons/lyq/" , "iconlyq" , 2, 1, 118, this.changeCloth.bind(this));
        this.sySubMenu   = new SubMenu("res/clothicons/sy/"  , "iconsy"  , 3, 1, 136, this.changeCloth.bind(this));
        this.xiazSubMenu = new SubMenu("res/clothicons/xiaz/", "iconxiaz", 4, 1, 115, this.changeCloth.bind(this));
        this.wzSubMenu   = new SubMenu("res/clothicons/wz/"  , "iconwz"  , 5, 1, 112, this.changeCloth.bind(this));
        this.xiezSubMenu = new SubMenu("res/clothicons/xiez/", "iconxiez", 6, 1, 203, this.changeCloth.bind(this));

        this.addChild(this.mainMenu, 2);
        this.addChild(this.fxSubMenu, 2);
        this.addChild(this.wtSubMenu, 2);
        this.addChild(this.lyqSubMenu, 2);
        this.addChild(this.sySubMenu, 2);
        this.addChild(this.xiazSubMenu, 2);
        this.addChild(this.wzSubMenu, 2);
        this.addChild(this.xiezSubMenu, 2);
    },

    addBG: function () {
        var size = cc.winSize;

        this.bg = new cc.Sprite("res/bj/bj1_1.jpg");

        this.bg.setPosition(size.width / 2, size.height / 2);

        this.addChild(this.bg, 0);
    },

    initCloth: function () {
        var size = cc.winSize;
        this.clothset = new ClothSet(1536, 2048);
        //this.clothset.setPosition(size.width / 2, size.height / 2);
        this.clothset.setScale(1, 1);
        this.addChild(this.clothset, 1);

        this.clothset.changeCloth("fx", 183);
        this.clothset.changeCloth("wt", 74);
        this.clothset.changeCloth("lyq", 51);
        //this.clothset.changeCloth("sy", 4);
        //this.clothset.changeCloth("xiaz", 22);
        this.clothset.changeCloth("wz", 46);
        this.clothset.changeCloth("xiez", 179);

        this.clothset.setBody("body");
    },

    changeCloth: function (type, idx) {
        var clothTypes =
        [
            "fx",
            "wt",
            "lyq",
            "sy",
            "xiaz",
            "wz",
            "xiez",
        ];

        this.clothset.changeCloth(clothTypes[type], idx);

        /*
        cc.log(type + ", " + idx);
        this.clothset.removeCloth(clothTypes[type]);
        if(idx!=-1)
            this.clothset.addCloth(clothTypes[type], idx);
        */
    }
});

var ClothScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new ClothSceneLayer();
        this.addChild(layer);
    }
});

