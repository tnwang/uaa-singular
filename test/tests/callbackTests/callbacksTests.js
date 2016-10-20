const loginUrl = 'http://localhost:8080/uaa/login';
const testAppUrl = 'http://localhost:8000/test/tests/callbackTests/testpage.html';
const logoutUrl = 'http://localhost:8080/uaa/logout.do';
module.exports = {
  'test logout callback is called on page load without login' : function (browser) {
    browser
      .url(testAppUrl)
      .waitForElementVisible('body', 1000)
      .pause(1200)
      .execute(function() {return info;}, [], function (result) {
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value.logouts, 1);
        this.assert.equal(result.value.identitiesReceived.length, 0);
      })
      .end();
  },

  'test identity change callback is called on page load while logged in' : function (browser) {
    browser
      .url(loginUrl)
      .waitForElementVisible('body', 1000)
      .setValue('input[name="username"]', 'marissa')
      .setValue('input[name="password"]', 'koala')
      .submitForm('input[name="username"]')
      .url(testAppUrl)
      .pause(1200)
      .execute(function() {return info;}, [], function (result) {
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value.logouts, 0);
        this.assert.equal(result.value.identitiesReceived.length, 1);
        this.assert.equal(result.value.identitiesReceived[0].user_name, 'marissa')
      })
      .end();
  },

  'test identity change callback is called when logged in' : function (browser) {
    browser
      .url(testAppUrl)
      .waitForElementVisible('body', 1000)
      .pause(1200)
      .execute(function() {return info;}, [], function (result) {
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value.logouts, 1);
        this.assert.equal(result.value.identitiesReceived.length, 0);
      })
      .execute(function (url, windowName) {
        window.open(url, windowName);
      }, [loginUrl, 'LOGIN_WINDOW'])
      .switchWindow('LOGIN_WINDOW', function(result) { console.log('Switch window returned: ', result); })
      .waitForElementVisible('body', 1000)
      .setValue('input[name="username"]', 'marissa')
      .setValue('input[name="password"]', 'koala')
      .submitForm('input[name="username"]')
      .closeWindow()
      .windowHandles(function(result) {
        browser.switchWindow(result.value[0], function(result) { console.log('Switch window returned: ', result); });
      })
      .pause(1200)
      .execute(function() {return info;}, [], function (result) {
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value.logouts, 1);
        this.assert.equal(result.value.identitiesReceived.length, 1);
        this.assert.equal(result.value.identitiesReceived[0].user_name, 'marissa')
      })
      .end();
  },

  'test identity change and logout callback is called when logged out' : function (browser) {
    browser
      .url(testAppUrl)
      .waitForElementVisible('body', 1000)
      .execute(function(url, name){
        window.open(url, name);
      }, [loginUrl, 'LOGIN_WINDOW'])
      .waitForElementVisible('body', 1000)
      .switchWindow('LOGIN_WINDOW', function(result){
        console.log("Switch to login_window returned: ", result);
      })
      .setValue('input[name="username"]', 'marissa')
      .setValue('input[name="password"]', 'koala')
      .submitForm('input[name="username"]')
      .pause(1200)
      .url(logoutUrl)
      .closeWindow()
      .windowHandles(function(result) {
        browser.switchWindow(result.value[0], function(result) { console.log('Switch window returned: ', result); });
      })
      .pause(1200)
      .execute(function() {return info;}, [], function (result) {
        console.log(result);
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value.logouts, 2);
        this.assert.equal(result.value.identitiesReceived.length, 1);
      })
      .end();
  }
};