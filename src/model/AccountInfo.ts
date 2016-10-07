var unirest = require('unirest');

export class AccountInfo {

    accountArr = [
        {name: "20000000003", pw: "vl12450", token: ''},
        {name: "20000000004", pw: "vl12450", token: ''}
    ];

    login(ac, pw) {
        unirest.post('https://api.weilutv.com/1/account/login')
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send({username: ac, password: pw})
            .end((res)=> {
                console.log(res.body);
                if (res.body.success) {
                    this._updateToken(ac, pw, res.body.result.token);
                    // this.accountArr.push({name: ac, pw: pw, token: res.body.result.token});
                }
                else throw "login failed";
            });
    }

    _updateToken(name, pw, token) {
        var isExist = false;
        for (var i = 0; i < this.accountArr.length; i++) {
            var acObj = this.accountArr[i];
            if (acObj.name == name) {
                acObj.token = token;
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            this.accountArr.push({name: name, pw: pw, token: token});
        }
    }
}