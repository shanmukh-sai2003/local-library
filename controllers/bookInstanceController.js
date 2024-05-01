const Author = require('../models/author');
const BookInstance = require('../models/bookinstance');
const Genre = require('../models/genre');


exports.bookInstanceList = async (req, res) => {
    try {
        const instanceList = await BookInstance.find({}).populate("book").exec();
        res.render('book_instance_list', {allInstances: instanceList});
    } catch (error) {
        console.log(error);
    }
}

exports.bookInstanceDetails = async (req, res) => {
    const instanceId = req.params.id;
    try {
        const instanceDetails = await BookInstance.findById(instanceId).populate("book");
        res.render('book_instance_detail_page', {instance: instanceDetails});
    } catch (error) {
        console.log(error);
    }
}
