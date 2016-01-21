/**
 * 文件描述
 * @author ydr.me
 * @create 2016-01-21 15:22
 */


'use strict';



var dato = require('ydr-utils').dato;

var pkg = require('./package.json');

var defaults = {
    tagName: 'script',
    progress: 'post-html',
    regList: [{
        reg: /\s{2,}/g,
        replace: ' '
    }, {
        reg: /[\n\r\t]/g,
        replace: ''
    }]
};

module.exports = function (configs) {
    configs = dato.extend({}, defaults, configs);

    var coolieHTMLTagTemplate = function (options) {
        if (options.progress !== configs.progress) {
            return options;
        }

        var coolie = this;

        options.code = coolie.matchHTML(options.code, {
            tag: configs.tagName
        }, function (node) {
            if (!node.attrs || !node.attrs[configs.attributeName]) {
                return node;
            }

            var url = node.attrs[configs.attributeName];
            var ret = coolie.buildResPath(url, options.file);
            node.attrs[configs.attributeName] = ret.url;
            return node;
        });

        return options;
    };

    coolieHTMLTagTemplate.package = pkg;

    return coolieHTMLTagTemplate;
};

module.exports.defaults = defaults;

