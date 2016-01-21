/**
 * html <template> content replacement
 * @author ydr.me
 * @create 2016-01-21 15:22
 */


'use strict';


var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;

var pkg = require('./package.json');

var defaults = {
    conditions: [{
        tagName: 'template'
    }, {
        tagName: 'script',
        type: /template/
    }],
    progress: 'post-html',
    replacements: [{
        reg: /\s{2,}/g,
        replace: ' '
    }, {
        reg: /[\n\r\t]/g,
        replace: ''
    }]
};

module.exports = function (configs) {
    configs = dato.extend({}, defaults, configs);

    var replace = function (content) {
        dato.each(configs.replacements, function (index, replacement) {
            content = content.replace(replacement.reg, replacement.replace);
        });

        return content;
    };

    var coolieHTMLTagTemplate = function (options) {
        if (options.progress !== configs.progress) {
            return options;
        }

        var coolie = this;

        dato.each(options.conditions, function (index, condition) {
            options.code = coolie.matchHTML(options.code, {
                tag: condition.tagName
            }, function (node) {
                if (!condition.type) {
                    condition.type = /.*/;
                }

                node.attrs = node.attrs || {};
                var matched = !!node.attrs.type;

                if (!matched) {
                    return node;
                }

                switch (typeis(condition.type)) {
                    case 'string':
                        matched = node.attrs.type === condition.type;
                        break;

                    case 'regexp':
                        matched = condition.type.test(node.attrs.type);
                        break;

                    case 'function':
                        matched = condition.type(node);
                        break;

                    default:
                        matched = false;
                }

                if (!matched) {
                    return node;
                }

                node.content = replace(node.content);
                return node;
            });
        });

        return options;
    };

    coolieHTMLTagTemplate.package = pkg;

    return coolieHTMLTagTemplate;
};

module.exports.defaults = defaults;

