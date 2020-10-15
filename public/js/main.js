import {NotesController} from '/js/notes.controller.js';

const inputForm = $(".container.header form").first();
const root = $(".container.notes").first();

const controller = new NotesController("/api/todos/", root, inputForm);


