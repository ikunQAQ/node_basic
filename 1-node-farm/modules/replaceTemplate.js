module.exports = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    //替换数据
    // /-/g 正则表达式, 全应用
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    // output = output.replace(/'{%FROM%}'/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output;
}
