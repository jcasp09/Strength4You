import {ObjectId} from 'mongodb';

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    },

    checkNumber(val, varName) {
        if (typeof val !== 'number') {
            throw `${varName || 'provided variable'} is not a number`;
        }

        if (isNaN(val)) {
            throw `${varName || 'provided variable'} is NaN`;
        }
    },

    checkArray(arr, varName) {
        if (!arr || !Array.isArray(arr))
            throw `You must provide an array of ${varName}`;
    },

    checkPassword(password) {
        password = this.checkString(password);
        if (password.length < 8) throw 'password must be at least 8 characters long';
        if (!/[0-9]/.test(password)) throw 'password must contain at least one number';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw 'password must contain at least one special character';
        if (/^[0-9!@#$%^&*(),.?":{}|<>]+$/.test(password)) throw 'password cannot be all numbers or special characters';
        return password;
    },

    checkDOB(dob) { if (!dob || isNaN(Date.parse(dob))) throw 'invalid date of birth' },

    checkCommentBody(body) {
        body = this.checkString(body)
        if (body.length > 500)
            throw `Comment must be less than 500 characters long`
        return body;
    } 
};

export default exportedMethods;