import {ObjectId} from 'mongodb';

const exportedMethods = {

    checkName(name, varName) {
        name = this.checkString(name, varName)
        if (/\d/.test(name))
            throw `Error: ${varName} cannot contain digits`
        if (name.length < 2 || name.length > 25)
            throw `Error: ${varName} needs to be at least 2 characters long and must not exceed 25 characters`

        return name
    },

    checkUser(user) {
        user = this.checkString(user, "User ID")
        if (user.length < 5 || user.length > 25)
            throw `Error: User ID needs to be at least 5 characters long and must not exceed 25 characters`

        return user.toLowerCase(); // Ex: phil and PhIL should count as the same userId
    },

    checkPassword(password) {
        password = this.checkString(password, "Password");
        if (/\s/.test(password))
            throw `Error: Password cannot contain spaces`

        if (password.length < 8)
            throw `Error: Password must be at least 8 characters long`

        if (!/[^a-zA-Z0-9]/.test(password))
            throw `Error: Password must contain at least one special character`

        if (!/\d/.test(password))
            throw `Error: Password must contain at least one digit`

        if (!/[A-Z]/.test(password))
            throw `Error: Password must contain at least one uppercase alphabetical character`

        return password
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

    checkEmail(email) {
        email = this.checkString(email, "Email")
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
            throw `Invalid email supplied`
        return email
    },

    checkDOB(dob) {
        let date = new Date(dob)
        let today = new Date()
        if (isNaN(date.getTime()))
            throw `Invalid dob supplied`
        if (date.getFullYear() > today.getFullYear() ||
            date.getFullYear() === today.getFullYear() && date.getMonth() > today.getMonth() ||
            date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() > today.getDate())
            throw `Cannot set a dob in the future`
        let cutoffDate = new Date();
        cutoffDate.setFullYear(today.getFullYear() - 13);
        if (date > cutoffDate) {
            throw `User must be older than 13 years`;
        }
    },

    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
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

    checkObject(obj, objName) {
        if (typeof obj !== 'object') {
          throw `${objName} is not an object`;
        }
        if (Object.keys(obj).length === 0)
            throw `${objName} has no fields`
    },

    checkCommentBody(body) {
        body = this.checkString(body, "Comment Body")
        if (body.length > 500)
            throw `Comment must be less than 500 characters long`
        return body;
    },

    checkHours(hours) {
        this.checkObject(hours, "Hours");
        if (Object.keys(hours).length > 7)
            throw `Invalid Hours: Too many fields supplied`
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        days = days.forEach((day) => hours[day] = this.checkDay(hours[day]))
        return hours;
    },

    checkDay(day) {
        if (!day) return "Closed"
        day = this.checkString(day, "Day");
        if (!/^(0[1-9]|1[0-2])(am|pm)-0[1-9]|1[0-2](am|pm)$/.test(day) && day !== "Closed")
            throw `Day's Hours is in invalid format`
        if (day === "Closed")
            return day
        let start = parseInt(day.substring(0, 2)), period1 = day.substring(2, 2), end = parseInt(day.substring(5, 2)), period2 = day.substring(7, 2)
        if (period1 == period2 && end <= start && day !== "12am-12am")
            throw `Day's Hours are invalid`
        return day;
    },

    checkEquipment(equipment) {
        this.checkArray(equipment);
        return equipment.map((machine) => {
            this.checkObject(machine);
            if (Object.keys(machine).length !== 2)
                throw `Machine is not valid in equipment`

            machine.type = this.checkString(machine.type, "Machine Type");
            if (machine.type.length > 50)
                throw `The length of the type of the machine cannot be more than 50 characters`
            this.checkNumber(machine.count, "Machine Count")
            return machine;
        })
    },

    checkClasses(classes) {
        this.checkArray(classes);
        let result = classes.map((c) => {
            this.checkObject(c);
            if (Object.keys(c).length !== 2)
                throw `Class is not valid`;
            
            c.name = this.checkString(c.name, "Class Name");
            if (c.name.length < 2 || c.name.length > 25)
                throw `Class Name needs to be at least 2 characters long and must not exceed 25 characters`;
    
            c.description = this.checkString(c.description, "Class Description");
            if (c.description.length < 10 || c.description.length > 500)
                throw `Class Description must be at least 50 characters and must not exceed 500 characters`;
    
            return c;
        });
        return result;
    },
    

    checkLink(link) {
        link = this.checkString(link, "Link");
        new URL(link);
        return link;
    },

    checkState(state) {
        state = this.checkString(state, "State")
        const validStates = [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
            'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
            'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
          ];
        if (!validStates.includes(state))
            throw `Invalid State supplied`
    
        return state;
    }
};

export default exportedMethods;