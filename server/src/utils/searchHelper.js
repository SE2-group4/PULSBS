/**
 * Custom binary search. The target value is searched on the property 'propertyName'
 * @param {Array} of Objects
 * @param {Any} target
 * @param {String} property
 * @returns {Integer} index. -1 if target is not found
 */
const binarySearch = (array, target, propertyName) => {
    let startIndex = 0;
    let endIndex = array.length - 1;

    while (startIndex <= endIndex) {
        let middleIndex = Math.floor((startIndex + endIndex) / 2);

        if (target === array[middleIndex][propertyName]) {
            return middleIndex;
        }

        if (target > array[middleIndex][propertyName]) {
            startIndex = middleIndex + 1;
        } else if (target < array[middleIndex][propertyName]) {
            endIndex = middleIndex - 1;
        }
    }

    return -1;
};

module.exports = { binarySearch };
