const Ad = require('../model/AdModel');

// Tạo quảng cáo mới
exports.createAd = async (req, res) => {
  try {
    const { title, tag, description} = req.body;
    const url_server = 'http://localhost:7777'
    const image = `${url_server}/${req.file.path}`
    console.log(req.body)
    const newAd = new Ad({ title, tag, description,image});
    const savedAd = await newAd.save();
    const json = {...savedAd, status:true}
    res.status(201).json(json);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Không thể thêm quảng cáo.' });
  }
};

// Xóa quảng cáo theo ID
exports.deleteAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const deletedAd = await Ad.findByIdAndDelete(adId);
    if (!deletedAd) {
      return res.status(404).json({ error: 'Không tìm thấy quảng cáo.' });
    }
    res.status(200).json({ message: 'Quảng cáo đã được xóa.' });
  } catch (error) {
    res.status(500).json({ error: 'Không thể xóa quảng cáo.' });
  }
};

// Lấy danh sách quảng cáo
exports.getAd = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Không thể lấy danh sách quảng cáo.' });
  }
};

// Cập nhật quảng cáo theo ID
exports.updateAdById = async (req, res) => {
  try {
    const adId = req.params.id;
    const { title, tag, description} = req.body;
    const updateData = { title, tag, description};
    if(req.file){
      const url_server = 'http://localhost:7777'
      const image = `${url_server}/${req.file.path}`
      updateData.image = image
    }
    console.log(updateData)
    const updatedAd = await Ad.findByIdAndUpdate(adId, updateData, { new: true, runValidators: true });

    if (!updatedAd) {
      return res.status(404).json({ error: 'Không tìm thấy quảng cáo.' });
    }
    const json = {...updatedAd, status:true}
    res.status(200).json(json);
  } catch (error) {
   
    res.status(500).json({ error: 'Không thể cập nhật quảng cáo.' });
  }
};
