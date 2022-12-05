const express = require('express');
const FeedModel = require('../models/feed');

const router = express.Router();

class FeedDB {
    static _inst_;
    static getInst = () => {
        if ( !FeedDB._inst_ ) FeedDB._inst_ = new FeedDB();
        return FeedDB._inst_;
    }



    constructor() { console.log("[Feed-DB] DB Init Completed"); }

    selectItems = async ( count, search ) => {
        try {
            const DBItemCount = await FeedModel.countDocuments();
            const upBound = 10*(count);
            const downBound = 10*(count-1);
            let OSearchFilter = {};
            console.log(search);
            if (search !== ""){
                OSearchFilter = {title:search};
            }
            const res = await FeedModel.find(OSearchFilter).sort({'likeCnt': -1}).limit(upBound).skip(downBound).exec();
            return { success: true, data: res };
        } catch (e) {
            console.log(`[Feed-DB] Select Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    insertItem = async( item ) => {
        const { title, content } = item;
        try {
            console.log(title, content);
            const OFindFilter = { title: title, content: content };
            const overlapList = await FeedModel.findOne(OFindFilter);
            if (overlapList !== null) {
                console.log("Already Existing Song!");
            }else{
                const newItem = new FeedModel({ title, content });
                const res = await newItem.save();
            }
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Insert Error: ${ e }`);
            return false;
        }
    }

    editItem = async ( id, item ) => {
        try {
            const { title, content } = item;
            const OUpdateFiler = { id: id };
            const res = await FeedModel.updateOne(OUpdateFiler, {$set: {title: title, content: content}});
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Update Error: ${ e }`);
            return false;
        }
    }


    deleteItem = async ( _id ) => {
        try {
            const ODeleteFiler = { _id: _id };
            const res = await FeedModel.deleteOne(ODeleteFiler);
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Delete Error: ${ e }`);
            return false;
        }
    }

    likeItem = async ( _id ) => {
        try {
            const OLikeFiler = { _id: _id };
            const res = await FeedModel.updateOne(OLikeFiler, {$inc: {likeCnt: 1}});
            console.log(res);
            return true;
        } catch (e) {
            console.log(`[Feed-DB] Delete Error: ${ e }`);
            return false;
        }
    }
}


const feedDBInst = FeedDB.getInst();

router.get('/getSong', async(req, res) => {
    try {
        const requestCount = parseInt(req.query.count);
        const requestSearch = (req.query.search);
        const dbRes = await feedDBInst.selectItems(requestCount, requestSearch);
        if (dbRes.success) return res.status(200).json( dbRes.data );
        else return res.status(500).json({ error: dbRes.data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/addSong', async(req, res) => {
   try {
       const { title, content } = req.body;
       const addResult = await feedDBInst.insertItem({ title, content });
       if (!addResult) return res.status(500).json({ error: dbRes.data })
       else return res.status(200).json({ isOK: true });
   } catch (e) {
       return res.status(500).json({ error: e });
   }
});

router.post('/editSong', async(req, res) => {
    try {
        const { id, title, content } = req.body;
        const editResult = await feedDBInst.editItem(parseInt(id), { title, content });
        if (!editResult) return res.status(500).json({ error: dbRes.data })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
 });


router.post('/deleteSong', async(req, res) => {
    try {
        const { _id } = req.body;
        const deleteResult = await feedDBInst.deleteItem(_id);
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isOK: true });
    }catch (e) {
        return res.status(500).json({ error: e });
    }
})

router.post('/likeSong', async(req, res) => {
    try {
        const { _id } = req.body;
        console.log(_id);
        const likeResult = await feedDBInst.likeItem(_id);
        if (!likeResult) return res.status(500).json({ error: "No item liked" })
        else return res.status(200).json({ isOK: true });
    }catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;