const fomattdDate = async (req, res) => {
    // Get the current date and time in the GMT+07:00 time zone
    const currentTimezoneOffset = -7 * 60; // Offset in minutes
    const currentTimestamp = Date.now(); // Get current timestamp in UTC
    // Adjust the timestamp based on the time zone offset
    const adjustedTimestamp = currentTimestamp - (currentTimezoneOffset * 60 * 1000);
    // Create a new Date object with the adjusted timestamp
    const dateInGMTPlus7 = new Date(adjustedTimestamp);
    // Format the date components
    const day = dateInGMTPlus7.getUTCDate().toString().padStart(2, '0');
    const month = (dateInGMTPlus7.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = dateInGMTPlus7.getUTCFullYear();
    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate);
    return formattedDate;
};

const fomattdTime = async (req, res) => {
    // Get the current date and time in the GMT+07:00 time zone
    const currentTimezoneOffset = -7 * 60; // Offset in minutes
    const currentTimestamp = Date.now(); // Get current timestamp in UTC

    // Adjust the timestamp based on the time zone offset
    const adjustedTimestamp = currentTimestamp - (currentTimezoneOffset * 60 * 1000);

    // Create a new Date object with the adjusted timestamp
    const dateInGMTPlus7 = new Date(adjustedTimestamp);

    // Format the time components
    const hours = dateInGMTPlus7.getUTCHours().toString().padStart(2, '0');
    const minutes = dateInGMTPlus7.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateInGMTPlus7.getUTCSeconds().toString().padStart(2, '0');

    // Construct the formatted time string
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    console.log(formattedTime);
    return formattedTime;
};

module.exports = {
    fomattdDate,
    fomattdTime
};
