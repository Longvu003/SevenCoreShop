//tạo 1 trang thông báo xác thực tài khoản

const html =(name) =>{
    return `
    <h1>Chào mừng ${name} đến với website</h1>
    <p>Để xác thực tài khoản, vui lòng click vào link sau</p>
    `
}

module.exports = {html}