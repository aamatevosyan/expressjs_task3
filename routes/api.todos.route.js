const {Router} = require('express');
const router = Router();
const Notes = require('../core/notes');
const { validate, ValidationError, Joi } = require('express-validation')

const notes = new Notes();

const newNoteValidation = {
    body: Joi.object({
      noteText: Joi.string().min(1).required()
    })
};

const uuidOnlyValidation = {
    params: Joi.object({
        uuid: Joi.string().guid({version:"uuidv4"}).required()
    })
};

const editNoteValidation = {
    body: Joi.object({
        noteText: Joi.string().min(1).required(),
        uuid: Joi.string().guid({version:"uuidv4"}).required()
    })
};

router.route('/')
    .get(function (req, res) {
        res.json({
            success: true,
            data: Object.fromEntries(notes.entries)
        });
    })
    .post(validate(newNoteValidation, {}, {}), function (req, res) {
        const {noteText} = req.body;
        notes.add(noteText);
        console.log(notes);

        res.json({
            success: true
        });
    });

router.route('/:uuid')
    .put(validate(uuidOnlyValidation, {}, {}), validate(newNoteValidation, {}, {}), function (req, res, next) {
        if (!notes.edit(req.params.uuid, req.body.noteText)) {
            next("Invalid uuid.");
        } else {
            res.json({
                success: true
            });
        }
    })
    .delete(validate(uuidOnlyValidation, {}, {}), function (req, res, next) {
        if (!notes.delete(req.params.uuid)) {
            next("Invalid uuid.");
        } else {
            res.json({
                success: true
            });
        }
    })

module.exports = router