const Transaction = require('../model/TransactionModel');

const getAndSaveTransactions = async (req, res) => {
    try {
      // Gọi API lấy dữ liệu giao dịch
      const response = await fetch('https://api.sieuthicode.net/historyapimbbank/3f023ef5cd400475ffff48d7b32dd53b');
      
      // Kiểm tra trạng thái của response
      if (!response.ok) {
        throw new Error(`Failed to fetch data from API. Status: ${response.status}`);
      }
  
      // Chuyển dữ liệu từ API thành JSON
      const data = await response.json();
    //   console.log(data['status']);
    //   console.log('API response data:', data);  // Log dữ liệu nhận được để kiểm tra
  
      // Kiểm tra xem data có hợp lệ không trước khi truy cập vào thuộc tính 'status'
      if (data && data.TranList) {
        const transactionsz = data.TranList;  // Lấy danh sách giao dịch từ API
        const savedTransactions = [];  // Mảng lưu các giao dịch đã lưu
  
        // Duyệt qua từng giao dịch và lưu vào DB
        for (const tran of transactionsz) {
        //   console.log("Processing transaction refNo:", tran['refNo']);
  
          try {
            // Kiểm tra giao dịch đã tồn tại trong DB chưa
            const existingTransaction = await Transaction.findOne({ tranId: tran['tranId'] });
  
            if (!existingTransaction) {
              // Nếu chưa có thì lưu giao dịch vào DB
              const newTransaction = new Transaction({
                refNo: tran['refNo'],
                tranId: tran['tranId'],
                // Chuyển đổi định dạng ngày tháng
                postingDate: new Date(tran['postingDate'].split(' ')[0].split('/').reverse().join('-') + 'T' + tran['postingDate'].split(' ')[1]),
                transactionDate: new Date(tran['transactionDate'].split(' ')[0].split('/').reverse().join('-') + 'T' + tran['transactionDate'].split(' ')[1]),
                accountNo: tran['accountNo'],
                // Chuyển đổi số từ chuỗi
                creditAmount: parseFloat(tran['creditAmount']),
                debitAmount: parseFloat(tran['debitAmount']),
                currency: tran['currency'],
                description: tran['description'],
                availableBalance: parseFloat(tran['availableBalance']),
                // Kiểm tra beneficiaryAccount có rỗng không
                beneficiaryAccount: tran['beneficiaryAccount'] || null
              });
  
              // Lưu giao dịch vào DB và thêm vào mảng savedTransactions
              const savedTran = await newTransaction.save();
              console.log(savedTran)
              savedTransactions.push(savedTran);
            } else {
              console.log(`Transaction with tranId ${tran['tranId']} already exists. Skipping.`);
            }
          } catch (err) {
            console.error(`Error processing transaction refNo ${tran['refNo']}:`, err);
          }
        }
  
        // Kiểm tra và phản hồi với kết quả
        if (savedTransactions.length > 0) {
          res.status(200).json({
            status: 'success',
            message: 'Lưu giao dịch thành công',
            data: savedTransactions
          });
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Không có giao dịch mới để lưu'
          });
        }
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ hoặc không có giao dịch để lưu'
        });
      }
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({
          status: 'error',
          message: 'Lỗi khi lấy và lưu giao dịch',
          error: error.message
        });
      }
      
  };

  // GET ALL TRANSACTIONS
const getAllTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find();
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error getting transactions:', error.message);
      res.status(500).json({
        status: 'error',
        message: 'Lỗi khi lấy danh sách giao dịch',
        error: error.message
      });
    }
  };
  
  

module.exports = { getAndSaveTransactions,getAllTransactions };
