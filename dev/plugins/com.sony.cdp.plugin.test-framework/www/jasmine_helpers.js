/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

'use strict';

// [CDP modified]: detect global object
function getGlobal() {
    if (null != window.parent) {
        return document.getElementsByTagName('iframe')[0].contentWindow;
    } else {
        return window;
    }
}

// [CDP modified]: detect document object
function getDocument() {
    if (null != window.parent) {
        return document.getElementsByTagName('iframe')[0].contentWindow.document;
    } else {
        return document;
    }
}

exports.setUpJasmine = function() {
    // Set up jasmine
    // [CDP modified]: detect jasmineRequire object
    var jasmineRequire = getGlobal().jasmineRequire;
    var jasmine = jasmineRequire.core(jasmineRequire);
    jasmineRequire.html(jasmine);
    var jasmineEnv = jasmine.currentEnv_ = new jasmine.Env();

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    jasmineEnv.catchExceptions(false);

    // Set up jasmine interface
    var jasmineInterface = jasmineRequire.interface(jasmine, jasmineEnv);

    // Add Reporters
    addJasmineReporters(jasmineInterface, jasmineEnv);

    // Add Spec Filter
    jasmineEnv.specFilter = function(spec) {
        //console.log(spec.getFullName());
        return true;
    };

    // Jasmine 2.2.0 moved this symbol, so we add a shim here.
    jasmine.Expectation.addMatchers = jasmine.Expectation.addMatchers || function() {
        return jasmine.addMatchers.apply(this, arguments);
    };

    return jasmineInterface;
}

function addJasmineReporters(jasmineInterface, jasmineEnv) {
    jasmineInterface.jsApiReporter = new jasmineInterface.jasmine.JsApiReporter({ timer: new jasmineInterface.jasmine.Timer() });
    jasmineEnv.addReporter(jasmineInterface.jsApiReporter);

    jasmineInterface.htmlReporter = new jasmineInterface.jasmine.HtmlReporter({
        env: jasmineEnv,
        queryString: function() { return null; },
        onRaiseExceptionsClick: function() { },
        getContainer: function() { return getDocument().getElementById('content'); },
        createElement: function() { return getDocument().createElement.apply(getDocument(), arguments); },
        createTextNode: function() { return getDocument().createTextNode.apply(getDocument(), arguments); },
        timer: new jasmineInterface.jasmine.Timer()
    });
    jasmineInterface.htmlReporter.initialize();
    jasmineEnv.addReporter(jasmineInterface.htmlReporter);

    // [CDP modified] change plugin id.
    var medic = require('com.sony.cdp.plugin.test-framework.medic');

    if (medic.enabled) {
        jasmineRequire.medic(jasmineInterface.jasmine);
        jasmineInterface.MedicReporter = new jasmineInterface.jasmine.MedicReporter({
            env: jasmineEnv,
            log: { logurl: medic.logurl },
            sha: medic.sha
        });
        jasmineInterface.MedicReporter.initialize();
        jasmineEnv.addReporter(jasmineInterface.MedicReporter);
    }
}
