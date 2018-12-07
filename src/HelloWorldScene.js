/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    pEraser: null,
    pRTex: null,

    ctor: function () {
        //////////////////////////////  
        // 1. super init first  
        this._super();

        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object  
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////  
        // 3. add your codes below...  
        // add a label shows "Hello World"  
        // create and initialize a label  
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen  
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2;
        // add the label as a child to this layer  
        this.addChild(helloLabel, 5);

        // hello world 背景图片  
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
        });
        this.addChild(this.sprite, 0);

        //橡皮擦  
        this.pEraser = new cc.DrawNode();
        this.pEraser.drawDot(cc.p(0, 0), 20, cc.color(255, 255, 255, 0));
        this.pEraser.retain();

        //通过pRTex实现橡皮擦  
        this.pRTex = new cc.RenderTexture(size.width, size.height);
        this.pRTex.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.pRTex, 10);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touches, event) {
                cc.log("start");
                var target = event.getCurrentTarget();

                var pBg = new cc.Sprite("res/body_1.png");
                var pBg1 = new cc.Sprite("res/dirt.png");
                pBg.setPosition(size.width / 2, size.height / 2);
                pBg1.setPosition(size.width / 2, size.height / 2);
                target.pRTex.beginWithClear(0, 0, 0, 0);
                pBg.visit();
                pBg1.visit();
                target.pRTex.end();

                return true;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                target.pEraser.setPosition(touch.getLocation());
                target.eraseByBlend();
            }
        }, this);

        return true;
    },

    eraseByBlend: function () {
        //橡皮檫图片中间透明的图。  BlendFunc为 cc.blendFunc(cc.ZERO, cc.SRC_ALPHA)

        //如果是实心外透明  BlendFunc为 cc.blendFunc(cc.ZERO, cc.ONE_MINUS_SRC_ALPHA)

        this.pEraser.setBlendFunc(cc.ZERO, cc.SRC_ALPHA);
        // this.pEraser.setBlendFunc(cc.ONE_MINUS_SRC_ALPHA, cc.ZERO);
        this.pRTex.begin();
        this.pEraser.visit();
        this.pRTex.end();
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

