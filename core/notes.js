const { v4 : uuidv4 } = require('uuid'); 

class Notes {
    constructor() {
        this.entries = new Map();
    }

    add(noteText) {
        const uuid = uuidv4();
        this.entries.set(uuid, noteText);
        return uuid;
    }

    delete(noteId) {
        return this.entries.delete(noteId);
    }

    edit(noteId, noteText) {
        if (this.entries.has(noteId)) {
            this.entries.set(noteId, noteText);
            return true;
        }
        return false;
    }

    get(noteId) {
        return this.entries.get(noteId);
    }
}

module.exports = Notes;