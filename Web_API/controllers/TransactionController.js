const Transaction = require("../model/TransactionModel");
const axios = require("axios");
const HttpsProxyAgent = require("https-proxy-agent");
const getAndSaveTransactions = async (req, res) => {
  try {
    // Cấu hình proxy
    const proxy = "http://user49073:6mpDNgvZ0r@42.96.5.118:49073";
    const agent = new HttpsProxyAgent(proxy);

    // Gọi API lấy dữ liệu giao dịch
    const response = await axios.get("https://s.net.vn/fg3z", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        DNT: "1", // Do Not Track header (optional)
      },
      httpsAgent: agent,
    });

    // Kiểm tra trạng thái của response
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }

    // Lấy dữ liệu từ API
    const data = response.data;

    // Kiểm tra dữ liệu API trả về
    if (data && data.TranList) {
      const transactionsz = data.TranList; // Danh sách giao dịch từ API
      const savedTransactions = []; // Mảng lưu các giao dịch đã lưu

      // Lặp qua danh sách giao dịch
      for (const tran of transactionsz) {
        try {
          // Kiểm tra giao dịch đã tồn tại trong DB chưa
          const existingTransaction = await Transaction.findOne({
            tranId: tran.tranId,
          });

          if (!existingTransaction) {
            // Nếu chưa có thì lưu giao dịch vào DB
            const newTransaction = new Transaction({
              refNo: tran.refNo,
              tranId: tran.tranId,
              // Chuyển đổi định dạng ngày tháng
              postingDate: new Date(
                tran.postingDate.split(" ")[0].split("/").reverse().join("-") +
                  "T" +
                  tran.postingDate.split(" ")[1]
              ),
              transactionDate: new Date(
                tran.transactionDate
                  .split(" ")[0]
                  .split("/")
                  .reverse()
                  .join("-") +
                  "T" +
                  tran.transactionDate.split(" ")[1]
              ),
              accountNo: tran.accountNo,
              // Chuyển đổi số từ chuỗi
              creditAmount: parseFloat(tran.creditAmount),
              debitAmount: parseFloat(tran.debitAmount),
              currency: tran.currency,
              description: tran.description,
              availableBalance: parseFloat(tran.availableBalance),
              // Kiểm tra beneficiaryAccount có rỗng không
              beneficiaryAccount: tran.beneficiaryAccount || null,
            });

            // Lưu giao dịch vào DB và thêm vào mảng savedTransactions
            const savedTran = await newTransaction.save();
            savedTransactions.push(savedTran);
          } else {
            console.log(
              `Transaction with tranId ${tran.tranId} already exists. Skipping.`
            );
          }
        } catch (err) {
          console.error(
            `Error processing transaction refNo ${tran.refNo}:`,
            err
          );
        }
      }

      // Kiểm tra và phản hồi với kết quả
      if (savedTransactions.length > 0) {
        res.status(200).json({
          status: "success",
          message: "Lưu giao dịch thành công",
          data: savedTransactions,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "Không có giao dịch mới để lưu",
        });
      }
    } else {
      res.status(400).json({
        status: "error",
        message: "Dữ liệu không hợp lệ hoặc không có giao dịch để lưu",
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi khi lấy và lưu giao dịch",
      error: error.message,
    });
  }
};

// GET ALL TRANSACTIONS
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transactions:", error.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi khi lấy danh sách giao dịch",
      error: error.message,
    });
  }
};

module.exports = { getAndSaveTransactions, getAllTransactions };
