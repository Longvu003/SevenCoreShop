import https from 'https';
import crypto from 'crypto';

// Cấu hình thông tin MoMo
const partnerCode = 'MOMO';
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const requestType = 'payWithMethod';
const partnerName = 'Test';
const storeId = 'MomoTestStore';

// Tạo QR thanh toán
export const createPaymentQR = ({
  userId,
  orderId,
  amount,
  orderInfo,
  paymentCode,
}: {
  userId: string;
  orderId: string;
  amount: string | number;
  orderInfo: string;
  paymentCode: string;
}) => {
  return new Promise((resolve, reject) => {
    const requestId = partnerCode + new Date().getTime();
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    // Đảm bảo amount là chuỗi số nguyên
    const amountStr = parseInt(amount.toString()).toString();

    // Tạo chữ ký (signature) theo định dạng yêu cầu
    const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    // Tạo body yêu cầu gửi đến MoMo
    const requestBody = JSON.stringify({
      partnerCode,
      partnerName,
      storeId,
      requestId,
      amount: amountStr,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      paymentCode,
      orderGroupId: '',
      signature,
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    // Gửi yêu cầu đến MoMo
    const momoReq = https.request(options, (momoRes) => {
      let data = '';
      momoRes.on('data', (chunk) => {
        data += chunk;
      });

      momoRes.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.resultCode === 0) {
            resolve({ payUrl: response.payUrl }); // Thành công, trả về URL thanh toán
          } else {
            resolve({
              error: true,
              message: response.message,
              resultCode: response.resultCode,
            });
          }
        } catch (err) {
          reject(new Error('Lỗi phân tích phản hồi từ MoMo.'));
        }
      });
    });

    momoReq.on('error', (error) => {
      console.error(`Problem with request: ${error.message}`);
      reject(new Error('Error creating payment request.'));
    });

    momoReq.write(requestBody);
    momoReq.end();
  });
};
