var ClothSet = cc.Node.extend({
    ctor: function (width, height) {
        this._super();

        this.body = null;
        this.cloths = {};
        this.cloths["fx"] = null;
        this.cloths["wt"] = null;
        this.cloths["lyq"] = null;
        this.cloths["sy"] = null;
        this.cloths["xiaz"] = null;
        this.cloths["wz"] = null;
        this.cloths["xiez"] = null;
    },

    setBody: function (clothType) {
        var prefix = "res/"

        this.cloths[clothType] = new Cloth(this, prefix, clothType, undefined);
    },

    changeCloth: function (clothType, idx) {
        var prefix = "res/cloth/"

        if (this.cloths[clothType]) {
            this.cloths[clothType].detach(this);
            this.cloths[clothType] = null;
        }
                
        if (clothType == "lyq" && idx!=-1) {
            // if new is lyq, remove sy, xiaz
            if(this.cloths["sy"])
            {
                this.cloths["sy"].detach(this);
                this.cloths["sy"] = null;
            }
            if (this.cloths["xiaz"])
            {
                this.cloths["xiaz"].detach(this);
                this.cloths["xiaz"] = null;
            }
        }
        else if (clothType == "lyq" && idx==-1) {
            // if remove lyq, wear sy, xiaz
            if(!this.cloths["sy"])
            {
                this.cloths["sy"] = new Cloth(this, prefix + "sy" + "/", "sy", 22);
            }
            if (!this.cloths["xiaz"])   // newcloth is lyq, no need sy, xiaz
            {
                this.cloths["xiaz"] = new Cloth(this, prefix + "xiaz" + "/", "xiaz", 6);
            }
        }        
        else if (clothType == "sy" && idx!=-1) { // if wear sy
            if(this.cloths["lyq"]) 
            {
                // remove lyq, wear siaz(underwear)
                this.cloths["lyq"].detach(this);
                this.cloths["lyq"] = null;

                this.cloths["xiaz"] = new Cloth(this, prefix + "xiaz" + "/", "xiaz", 6);
            }
        }
        else if (clothType == "sy" && idx==-1) { // if wear sy
            if(this.cloths["lyq"]) 
            {
                // remove lyq, wear sy(underwear), wear xiaz(underwear)
                this.cloths["lyq"].detach(this);
                this.cloths["lyq"] = null;

                this.cloths["sy"] = new Cloth(this, prefix + "sy" + "/", "sy", 22);
                this.cloths["xiaz"] = new Cloth(this, prefix + "xiaz" + "/", "xiaz", 6);
            }
            else
            {
                this.cloths["sy"] = new Cloth(this, prefix + "sy" + "/", "sy", 22);
            }
        }        
        else if (clothType == "xiaz" && idx!=-1) { // if wear xiaz
            if(this.cloths["lyq"]) 
            {
                // remove lyq, wear sy(underwear)
                this.cloths["lyq"].detach(this);
                this.cloths["lyq"] = null;

                this.cloths["sy"] = new Cloth(this, prefix + "sy" + "/", "sy", 22);
            }
        }
        else if (clothType == "xiaz" && idx==-1) {  // if remove xiaz
            if(this.cloths["lyq"]) 
            {
                // remove lyq, wear sy(underwear), wear xiaz(underwear)
                this.cloths["lyq"].detach(this);
                this.cloths["lyq"] = null;

                this.cloths["sy"] = new Cloth(this, prefix + "sy" + "/", "sy", 22);
                this.cloths["xiaz"] = new Cloth(this, prefix + "xiaz" + "/", "xiaz", 6);
            }
            else
            {
                this.cloths["xiaz"] = new Cloth(this, prefix + "xiaz" + "/", "xiaz", 6);                
            }
        } 

        if(idx!=-1)
            this.cloths[clothType] = new Cloth(this, prefix + clothType + "/", clothType, idx);
    },

    getCloth: function (clothType) {
        return this.cloths[clothType];
    }
});  