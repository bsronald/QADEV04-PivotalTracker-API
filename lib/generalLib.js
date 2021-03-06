//General Lib
/*
@ Author Ronald Butron
@ General Lib
 */


var request = require('superagent');
require('superagent-proxy')(request);
var endPoints = require('../resources/endPoints.json');
var config = require('../resources/config.json');
var log = require('../resources/log4js');
var proxy = config.proxy;
var tokenHeader = config.tokenHeader;
var type = config.type;
var appJson = config.json;

/**
 * @param  {argument that will send to the request}
 * @param  {Token to get access to the APP}
 * @param  {endPoint is the URL}
  * @return {Callback that return the request}
 */
var post = function(argument, token, endPoint, callback) {

    request
        .post(endPoint)
        .proxy(proxy)
        .set(tokenHeader, token)
        .set(type, appJson)
        .send(argument)
        .end(function(err, res) {

            if (err) {
               log.error('Error to Create' + JSON.stringify(err));
            } else {
               log.info('Created-----' + JSON.stringify(res.body));
            }
            callback(res);
        });
};

exports.post = post;

/**
 * @param  {argument that will send to the request}
 * @param  {Token to get access to the APP}
 * @param  {endPoint is the URL}
  * @return {Callback that return the request}
 */

var put = function(argument, token, endpoint, callback) {
	
	request
        .put(endpoint)
        .proxy(proxy)
        .set(tokenHeader, token)
		.set(type, appJson)
        .send(argument)
        .end(function(err, res) {

            if (err) {
                log.error('\t\tError to Update' + JSON.stringify(err));
            } else {
                log.info('\t\t----Updated-----' + JSON.stringify(res.body));
            }
            callback(res);
        });

}
exports.put = put;

/**
 * @param  {Token to get access to the APP}
 * @param  {endPoint is the URL}
  * @return {Callback that return the request}
 */
var get = function (token, endPoint, callback) {

		request
			.get(endPoint)
			.proxy(proxy)
			.set(tokenHeader, token)
			.end(function(err, res){
				if (err) {
					log.error('\t\tError to Get'+JSON.stringify(err));
				} else {
					log.info('\t\t-----Get-----'+JSON.stringify(res.body));
				}

				callback(res);
			});
}
		
exports.get = get;

/**
 * @param  {Token to get access to the APP}
 * @param  {endPoint is the URL}
 * @return {Callback that return the request}
 */
var del = function(token, endPoint, callback){
	
	request
		.del(endPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set(type, appJson)
		.end(function (err,res) {
			if (err) {
				log.error('\t\tError Deleting......'+JSON.stringify(err));
			} else {
				log.info('\t\t-----Deleted-----'+JSON.stringify(res.body));
			}	
			callback(res);		
		});
};

exports.del = del;
