var MainMenuState =
{
    "Active": 0,
    "Transition": 1,
    "InActive": 2
};

var MainMenu = cc.Layer.extend({
    ctor: function (icons, cb) {
        this._super();

        var size = cc.winSize;
        this.setPosition(size.width - 200, size.height / 2);
        this.cb = cb;
        this.state = MainMenuState.Active;
        this.moveOut = cc.Sequence.create(cc.MoveBy.create(0.2, 400, 0), cc.CallFunc.create(this.moveOutFinished, this));
        this.moveIn = cc.Sequence.create(cc.MoveBy.create(0.2, -400, 0), cc.CallFunc.create(this.moveInFinished, this));

        this.scheduleUpdate();

        for (var i = 0; i < icons.length; i++) {
            var sprite = new cc.Sprite(icons[i]);
            sprite.x = 0;
            sprite.y = ((icons.length / 2 - 1 + 0.5) - i) * 140 * 2;
            sprite.setScale(2, 2);
            sprite.setOpacity(192);
            sprite.setTag(i);
            this.addChild(sprite, 3);
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,

                swallowTouches: false,

                onTouchBegan: function (touch, event) {
                    switch (this.state) {
                        case MainMenuState.Active:
                            this.onActiveStateTouchBegan(touch, event);
                            break;
                        case MainMenuState.Transition:
                            this.onTransitionStateTouchBegan(touch, event);
                            break;
                        case MainMenuState.InActive:
                            this.onInActiveStateTouchBegan(touch, event);
                            break;
                    };

                    return true;
                }.bind(this),

                onTouchEnded: function (touch, event) {
                    switch (this.state) {
                        case MainMenuState.Active:
                            this.onActiveStateTouchEnded(touch, event);
                            break;
                        case MainMenuState.Transition:
                            this.onTransitionStateTouchEnded(touch, event);
                            break;
                        case MainMenuState.InActive:
                            this.onInActiveStateTouchEnded(touch, event);
                            break;
                    };
                }.bind(this),
            });

            cc.eventManager.addListener(listener.clone(), sprite);
        }

        return true;
    },

    update: function () {
        switch (this.state) {
            case MainMenuState.Active:
                this.onActiveStateUpdate();
                break;
            case MainMenuState.Transition:
                this.onTransitionStateUpdate();
                break;
            case MainMenuState.InActive:
                this.onInActiveStateTouchUpdate();
                break;
        };
    },

    moveIn: function () {
        this.state = MainMenuState.Active;
    },    

    moveOut: function () {
        this.state = MainMenuState.Active;
    },

    moveInFinished: function () {
        this.state = MainMenuState.Active;
    },    

    moveOutFinished: function (moveOut) {
        this.state = MainMenuState.InActive;
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
            var event = new cc.EventCustom("OpenSubMenu");
            event.setUserData(target.getTag());
            cc.eventManager.dispatchEvent(event);

            this.runAction(this.moveOut);

            this.state = MainMenuState.Transition;
        }
    },

    onTransitionStateTouchBegan: function (touch, event) {
    },

    onInActiveStateTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (!cc.rectContainsPoint(rect, locationInNode)) {
            cc.log(locationInNode);

            target.setOpacity(255);
            var event = new cc.EventCustom("CloseSubMenu");
            // event.setUserData(target.getTag());
            cc.eventManager.dispatchEvent(event);            

            this.runAction(this.moveIn);

            this.state = MainMenuState.Transition;
        }
    },

    onActiveStateTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        target.setOpacity(192);
    },

    onTransitionStateTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        target.setOpacity(192);        
    },

    onInActiveStateTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        target.setOpacity(192);        
    }
});