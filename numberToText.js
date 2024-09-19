const UNITS = ["", "mươi", "trăm", "nghìn", "triệu", "tỷ"];
const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function numberToWords(number) {
    if (number === 0) return DIGITS[0];

    let words = "";
    let unitIndex = 0;
    let strNumber = number.toString();

    while (strNumber.length > 0) {
        let threeDigits = parseInt(strNumber.slice(-3), 10);
        strNumber = strNumber.slice(0, -3);

        let part = threeDigitsToWords(threeDigits);
        if (part) {
            words = part + (UNITS[unitIndex] ? " " + UNITS[unitIndex] : "") + " " + words;
        }
        unitIndex++;
    }

    return words.trim();
}

function threeDigitsToWords(number) {
    let words = "";
    let hundred = Math.floor(number / 100);
    let rest = number % 100;
    let ten = Math.floor(rest / 10);
    let unit = rest % 10;

    if (hundred > 0) {
        words += DIGITS[hundred] + " trăm ";
        if (rest === 0) return words.trim();
    } else if (number > 0) {
        words += "không trăm ";
    }

    if (ten > 1) {
        words += DIGITS[ten] + " mươi ";
        if (unit === 1) {
            words += "mốt";
        } else if (unit === 5) {
            words += "lăm";
        } else if (unit > 0) {
            words += DIGITS[unit];
        }
    } else if (ten === 1) {
        words += "mười ";
        if (unit > 0) {
            if (unit === 5) {
                words += "lăm";
            } else {
                words += DIGITS[unit];
            }
        }
    } else if (unit > 0) {
        if (hundred > 0) {
            words += "lẻ ";
        }
        words += DIGITS[unit];
    }

    return words.trim();
}

// Test
let number = 115;
console.log(numberToWords(number)); // "một trăm mười lăm"
