var MainMenu = cc.Layer.extend({
    ctor: function () {
        this._super();

        var icons =
            [
                "res/clothicons/zz/zz_fx.png",
                "res/clothicons/zz/zz_wt.png",
                "res/clothicons/zz/zz_lyq.png",
                "res/clothicons/zz/zz_sy.png",
                "res/clothicons/zz/zz_xiaz.png",
                "res/clothicons/zz/zz_wz.png",
                "res/clothicons/zz/zz_xiez.png",
            ];

        var iconIDs =
            [
                ClothsID.FX,
                ClothsID.WT,
                ClothsID.LYQ,
                ClothsID.SY,
                ClothsID.XIAZ,
                ClothsID.WZ,
                ClothsID.XIEZ,
            ];

        var size = cc.winSize;

        var scrollView = ccui.ScrollView.create();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        //scrollView.setTouchEnabled(true);
        //scrollView.setBounceEnabled(true);
        //scrollView.setInertiaScrollEnabled(true);
        scrollView.setSize(cc.size(400, 2048));
        scrollView.x = size.width / 2;
        scrollView.y = size.height / 2;
        scrollView.setPosition(size.width - scrollView.width, size.height / 2);
        scrollView.setInnerContainerSize(cc.size(400, 120 * 2 * icons.length));
        this.addChild(scrollView, 10);

        for (var i = 0; i < icons.length; i++) {
            var sprite = new cc.Sprite(icons[i]);
            sprite.x = scrollView.width / 2;
            sprite.y = ((icons.length - 1) - i) * 120 * 2;
            sprite.setScale(2, 2);
            scrollView.addChild(sprite);
        }

        scrollView.jumpToTop();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan: function (touches, event) {
                var target = event.getCurrentTarget();
                return true;
            }.bind(this),

            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                //target.x += delta.x;
                //target.y += delta.y;
            }.bind(this)
        }, this.texture);

        return true;
    }
});