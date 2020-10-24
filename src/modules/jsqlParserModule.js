const parser = require('js-sql-parser');
let defaultQuery = 'select * from dual where';
const commonModule = require("./common.module");
let whereCondition = '';


exports.getWhereClause = (condition, show_deleted) => {
    let includeDeleted = '';
    console.log(show_deleted);
    let andClause = commonModule.isValidString(condition) ? 'AND' : '';
    if(condition.length == 0){
        if (show_deleted) {
            includeDeleted = `delete_time != null or create_time != null`;
        }else{
            includeDeleted = `delete_time = null and create_time != null`;
        }
    }else{
        if (show_deleted) {
            includeDeleted = `delete_time != null`;
        }else{
            includeDeleted = `delete_time = null`;
        }
    }
    whereCondition = parser.parse(`${defaultQuery} ${condition} ${andClause} ${includeDeleted}`);
    let result = getLogicalOperator(whereCondition.value.where);
    console.log(result);
    return result;
}

function createOrCondition(condition) {
    return OrCondition = {
        $or: [getLogicalOperator(condition.left), getLogicalOperator(condition.right)]
    }
}

function createAndCondition(condition) {
    return AndCondition = {
        $and: [getLogicalOperator(condition.left), getLogicalOperator(condition.right)]
    }
}


function createNotCondition(condition) {
    console.log(condition)
    // return NotCondition = {
    //     $not: [getLogicalOperator(condition.left), getLogicalOperator(condition.right)]
    // }
}

function createLikePredicate(condition) {
    const value = condition.right.value == 'null' ? null : condition.right.value.replace(/'/g, "")
    let con = {
        [condition.left.value]:
        {
            $regex: value
        }
    }
    return con;
}

function createComparsionExpression(condition) {
    console.log(condition)
    const value = condition.right.value == 'null' ? null : condition.right.value.replace(/'/g, "")
    let con = {
        [condition.left.value]:
        {
            [getComparsionOperator(condition.operator).replace(/'/g, "")]: value
        }
    }
    return con;
}


//<>,in,nin not considered yet
function getComparsionOperator(operator) {
    switch (operator) {
        case '=':
            return '$eq';
        case '>=':
            return '$gte';
        case '>':
            return '$gt';
        case '<=':
            return '$lte';
        case '<':
            return '$lt';
        case '!=':
            return '$ne';
        default: return;
    }
}

function getLogicalOperator(condition) {
    // console.log(condition)
    switch (condition.type) {
        case 'OrExpression':
            return createOrCondition(condition)
        case 'AndExpression':
            return createAndCondition(condition)
        case 'NotExpression':
            return createNotCondition(condition)
        case 'XORExpression':
            return createXorCondition(condition)
        case 'ComparisonBooleanPrimary':
            return createComparsionExpression(condition);
        case 'LikePredicate':
            return createLikePredicate(condition)
        default: return;
    }
}
