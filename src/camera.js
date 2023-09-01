const axios = require('axios');
const qs = require('querystring');
const API = require('./api');
const xml2js = require('xml2js');
module.exports = class Camera {
    constructor(deviceSerial, token) {
        this.deviceSerial = deviceSerial;
        this.accessToken = token;
    }

    async parseXML(xmlString) {
        const parser = new xml2js.Parser({ explicitArray: false, trim: true, cdata: true });

        return new Promise((resolve, reject) => {
            parser.parseString(xmlString, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async canParseXML(data) {
        try {
            const parseData = await this.parseXML(data);
            return !!parseData;
        } catch (e) {
            return false;
        }
    }

    async getInfo() {
        const response = await axios.post(API.DEVICE_QUERY.INFO, qs.stringify({
            accessToken: this.accessToken,
            deviceSerial: this.deviceSerial
        }));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async defence(isDefence) {
        const response = await axios.post(API.DEVICE_SET.ARMING, qs.stringify({
            accessToken: this.accessToken,
            deviceSerial: this.deviceSerial,
            isDefence
        }));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async getLiveAddress(expireTime = 62208000, channelNo = 1) {
        const response = await axios.post(API.LIVE.LIMIT_LIST, qs.stringify({
            accessToken: this.accessToken,
            deviceSerial: this.deviceSerial,
            expireTime,
            channelNo
        }));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async getDefenceTime() {
        const response = await axios.post(API.DEVICE_SET.ARMING, qs.stringify({
            accessToken: this.accessToken,
            deviceSerial: this.deviceSerial,
        }));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async setDefenceTime(startTime, stopTime, period, enable, channelNo) {
        const response = await axios.post(API.DEVICE_SET.ARMING, qs.stringify({
            accessToken: this.accessToken,
            deviceSerial: this.deviceSerial,
            startTime,
            stopTime,
            period,
            enable,
            channelNo
        }));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async alarmList(pageStart = 0, pageSize = 10, startTime, endTime, alarmType, status) {
        const response = await axios.post(API.ALARM.DEVICE, qs.stringify({
                deviceSerial: this.deviceSerial,
                accessToken: this.accessToken,
                pageStart,
                pageSize,
                startTime,
                endTime,
                alarmType,
                status
            }
        ));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async startCtrl(direction, speed = 1, channelNo = 1) {
        const response = await axios.post(API.YUNTAI.START, qs.stringify({
                deviceSerial: this.deviceSerial,
                accessToken: this.accessToken,
                direction,
                speed,
                channelNo
            }
        ));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async stopCtrl(direction, channelNo = 1) {
        const response = await axios.post(API.YUNTAI.STOP, qs.stringify({
                deviceSerial: this.deviceSerial,
                accessToken: this.accessToken,
                direction,
                channelNo
            }
        ));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async capacity() {
        const response = await axios.post(API.DEVICE_QUERY.CAPACITY, qs.stringify({
                deviceSerial: this.deviceSerial,
                accessToken: this.accessToken
            }
        ));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async capture(channelNo=1) {
        const response = await axios.post(API.DEVICE_MANAGER.CAPTURE, qs.stringify({
            deviceSerial: this.deviceSerial,
            accessToken: this.accessToken,
            channelNo
        }));
        if (response.data.code != 200) {
            throw  Error(response.data.msg);
        }
        return response.data.data;
    }

    async subScribeEvent() {
        const response = await axios.post(API.DEVICE_MANAGER.SUBSCRIBE_EVENT, qs.stringify({
            deviceSerial: this.deviceSerial,
            accessToken: this.accessToken,
            'method': 'POST',
        }));
        const resData = await this.parseXML(response.data.data);
        if (!resData.SubscribeEventResponse && resData.ResponseStatus.statusString !== 'OK') {
            throw  Error(resData.statusString);
        }
        return {success: 'ture'};
    }


};

