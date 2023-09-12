import moment from "moment"

export const endOfFirstWeek = moment().subtract(3, 'weeks').format('DD MMM')
export const endOfSecondWeek = moment().subtract(2, 'weeks').format('DD MMM')
export const endOfThirdWeek = moment().subtract(1, 'weeks').format('DD MMM')
export const endOfFourthWeek = moment().format('DD MMM')