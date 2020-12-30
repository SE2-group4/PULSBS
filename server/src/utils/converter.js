/**
 * Convert an object's value to Numbers
 * @param  {Object} custNumbers { <arg1>: "1", <arg2>: "2.0"}
 * @returns {Object} { <arg1>: 1, <arg2>: 2}. It returns the first property which has value !== NaN { error: { <arg1>: <value>} }
 */
function convertToNumbers(custNumbers) {
    if (isUndefinedOrNull(custNumbers)) {
        return { error: { msg: `argument is ${custNumbers}` } };
    }

    const converted = {};

    for (const [key, num] of Object.entries(custNumbers)) {
        if (!isNaN(num)) {
            converted[key] = Number(num);
        } else {
            return { error: { [key]: num } };
        }
    }

    return converted;
}

/**
 * Convert an object's value to Booleans
 * @param  {Object} custBooleans { <arg1>: "tRue", <arg2>: "false"}
 * @returns {Object} { <arg1>: true, <arg2>: false}. It returns the first property which value is not Boolean { error: { <arg1>: <value>} }
 */
function convertToBooleans(custBooleans) {
    if (isUndefinedOrNull(custBooleans)) {
        return { error: { msg: `argument is ${custBooleans}` } };
    }

    const converted = {};
    for (const [key, value] of Object.entries(custBooleans)) {
        converted[key] = toBoolean(value);
        if (converted[key] === undefined) {
            return { error: { [key]: value } };
        }
    }

    return converted;
}

/**
 * Convert value to Boolean
 * @param  {Any} value
 * @returns {Boolean} undefined in case of error
 */
function toBoolean(value) {
    if (isUndefinedOrNull(value)) return undefined;
    else if (isBoolean(value)) return value;
    else if (isString(value)) return convertStringToBoolean(value);
}

/**
 * Convert a String to Boolean
 * @param  {String} custNumbers { <arg1>: "1", <arg2>: "2.0"}
 * @returns {Boolean}
 * @returns {undefined} error
 */
function convertStringToBoolean(value) {
    if (value.toLowerCase() === "true") return true;
    else if (value.toLowerCase() === "false") return false;
    else return undefined;
}

/**
 * check if value is null or undefined
 * @param  {Any} value
 * @returns {Boolean} result of comparison
 */
function isUndefinedOrNull(value) {
    return value === undefined || value === null;
}

/**
 * check if value is string
 * @param  {Any} value
 * @returns {Boolean} result of comparison
 */
function isString(value) {
    return typeof value === "string";
}

/**
 * check if value is boolean
 * @param  {Any} value
 * @returns {Boolean} result of comparison
 */
function isBoolean(value) {
    return value === true || value === false;
}

/**
 * check if object is empty
 * @param  {Any} value
 * @returns {Boolean} result of comparison
 */
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * check if value is of type acceptedType
 * @param  {Any} value
 * @returns {Boolean} result of comparison
 */
function isValueOfType(acceptedType, value) {
    const type = acceptedType.toLowerCase();

    switch (type) {
        case "boolean": {
            return isBoolean(toBoolean(value));
        }
        case "string": {
            return typeof value === "string";
        }
        default: {
            console.log(`${type} not implemented in isValueOfType`);
            return false;
        }
    }
}
module.exports = { convertToNumbers, convertToBooleans, isObjectEmpty, isValueOfType, toBoolean };
