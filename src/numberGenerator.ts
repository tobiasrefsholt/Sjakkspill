import crypto from 'crypto';

function generatePin() {
    let min = 100000;
    let max = 999999;
    return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-6);
}

// generateId :: Integer -> String
function generateId() {
    return crypto.randomBytes(32).toString('hex');
}

export = { generatePin, generateId };