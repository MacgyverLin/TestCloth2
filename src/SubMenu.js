var SubMenuState =
{
    "Active": 0,
    "Transition": 1,
    "InActive": 2
};

var SubMenu = cc.Layer.extend({
    ctor: function (rootPath, prefix, subMenuId, start, end, cb) {
        this._super();

        var size = cc.winSize;
        var numIcons = (end - start)

        var cross = new cc.Sprite("/res/clothicons/cross.png")
        cross.setPosition(-100, size.height-250);
        this.addChild(cross);        

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            swallowTouches: false,

            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
        
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    var tag = target.getTag();
                    this.cb(this.subMenuId, -1);
                }

                return true;
            }.bind(this),

            onTouchEnded: function (touch, event) {
            }.bind(this),
        });
        cc.eventManager.addListener(listener.clone(), cross);


        this.setPosition(size.width + 200, 0);

        this.subMenuId = subMenuId;
        this.state = SubMenuState.InActive;
        this.moveOut = cc.Sequence.create(cc.MoveBy.create(0.2, 500, 0), cc.CallFunc.create(this.moveOutFinished, this));
        this.moveIn = cc.Sequence.create(cc.MoveBy.create(0.2, -500, 0), cc.CallFunc.create(this.moveInFinished, this));
        this.cb = cb;

        this.touchDownPosition = 0;
        this.scheduleUpdate();

        var scrollView = ccui.ScrollView.create();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setBounceEnabled(true);
        scrollView.setInertiaScrollEnabled(true);
        scrollView.setPosition(0, 0);
        scrollView.setSize(cc.size(300, size.height));
        scrollView.setInnerContainerSize(cc.size(300, 250 * 1.5 * numIcons));
        this.addChild(scrollView, 3);

        var y = 0;
        for (var i = start; i <= end; i++) {
            var filename = rootPath + prefix + + i + ".png";
            var sprite = new cc.Sprite(filename);
            sprite.x = scrollView.width / 2;
            sprite.y = (numIcons - i) * 250 * 1.5;
            sprite.setScale(1.5, 1.5);
            sprite.setOpacity(192);
            sprite.setTag(i);
            scrollView.addChild(sprite, 3);

            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,

                swallowTouches: false,

                onTouchBegan: function (touch, event) {
                    switch (this.state) {
                        case SubMenuState.Active:
                            this.onActiveStateTouchBegan(touch, event);
                            break;
                        case SubMenuState.Transition:
                            this.onTransitionStateTouchBegan(touch, event);
                            break;
                        case SubMenuState.InActive:
                            this.onInActiveStateTouchBegan(touch, event);
                            break;
                    };

                    return true;
                }.bind(this),

                onTouchEnded: function (touch, event) {
                    switch (this.state) {
                        case SubMenuState.Active:
                            this.onActiveStateTouchEnded(touch, event);
                            break;
                        case SubMenuState.Transition:
                            this.onTransitionStateTouchEnded(touch, event);
                            break;
                        case SubMenuState.InActive:
                            this.onInActiveStateTouchEnded(touch, event);
                            break;
                    };
                }.bind(this),
            });

            cc.eventManager.addListener(listener.clone(), sprite);
        }

        scrollView.jumpToTop();

        var openSubMenuListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,

            eventName: "OpenSubMenu",

            callback: function (event) {
                var id = event.getUserData();
                if (id != this.subMenuId)
                    return;

                this.runAction(this.moveIn);
                this.state = MainMenuState.Transition;
            }.bind(this)
        });
        cc.eventManager.addListener(openSubMenuListener, 1);

        var closeSubMenuListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,

            eventName: "CloseSubMenu",

            callback: function (event) {
                if (this.state == MainMenuState.InActive)
                    return;

                this.runAction(this.moveOut);
                this.state = MainMenuState.Transition;
            }.bind(this)
        });
        cc.eventManager.addListener(closeSubMenuListener, 1);

        return true;
    },

    update: function () {
        switch (this.state) {
            case SubMenuState.Active:
                this.onActiveStateUpdate();
                break;
            case SubMenuState.Transition:
                this.onTransitionStateUpdate();
                break;
            case SubMenuState.InActive:
                this.onInActiveStateTouchUpdate();
                break;
        };
    },

    moveInFinished: function () {
        this.state = SubMenuState.Active;
    },

    moveOutFinished: function (moveOut) {
        this.state = SubMenuState.InActive;
    },

    onActiveStateUpdate: function () {
    },

    onTransitionStateUpdate: function () {
    },

    onInActiveStateTouchUpdate: function () {
    },

    onActiveStateTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            cc.log(locationInNode);
            cc.log(target.getTag());

            target.setOpacity(255);

            this.touchDownPosition = touch.getLocation();
        }
    },

    onTransitionStateTouchBegan: function (touch, event) {
    },

    onInActiveStateTouchBegan: function (touch, event) {
    },

    onActiveStateTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            // cc.log(locationInNode);
            // cc.log(target.getTag());

            target.setOpacity(192);

            var newpos = touch.getLocation();
            var oldpos = this.touchDownPosition;
            var length = Math.sqrt((newpos.x - oldpos.x) * (newpos.x - oldpos.x)  + 
                         (newpos.y - oldpos.y) * (newpos.y - oldpos.y)) ;
            if (length < 5) {
                if (this.cb) {
                    var tag = target.getTag();
                    this.cb(this.subMenuId, tag);
                }
            }
        }
    },

    onTransitionStateTouchEnded: function (touch, event) {
    },

    onInActiveStateTouchEnded: function (touch, event) {
    }
});